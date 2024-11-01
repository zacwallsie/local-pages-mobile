import React, { useState, useRef, useEffect, useCallback } from "react"
import { View, StyleSheet, Dimensions, ActivityIndicator as RNActivityIndicator, TouchableOpacity, ScrollView, Linking, Platform } from "react-native"
import MapView, { Marker, Region, MapPressEvent } from "react-native-maps"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { TextInput, Button, Text, Snackbar, List, Portal, Modal } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Location from "expo-location"
import AsyncStorage from "@react-native-async-storage/async-storage"
import debounce from "lodash/debounce"
import { ErrorBoundary } from "../common/ErrorBoundary"
import { ServiceSelector } from "../common/ServiceSelector"
import { Colors } from "@/constants/Colors"
import { CustomMarker } from "./CustomMarker"
import { ServiceCategory, ServiceCategoryKey, Company } from "@/types/supabase"
import { CompanyList } from "@/components/search/CompaniesList"
import { searchServiceAreas } from "@/utils/searchServiceAreas"

// Types and Interfaces
type ServiceType = keyof typeof ServiceCategory

interface Coordinates {
	latitude: number
	longitude: number
}

interface NominatimResult {
	place_id: number
	lat: string
	lon: string
	display_name: string
}

interface SearchHistory {
	id: string
	address: string
	service: ServiceType
	location: Coordinates
	timestamp: number
}

interface SearchScreenProps {
	onSearch?: (params: { address: string; service: ServiceCategoryKey; location: Coordinates; query?: string }) => Promise<void>
}

// Constants
const { height: SCREEN_HEIGHT } = Dimensions.get("window")

const BRISBANE_REGION: Region = {
	latitude: -27.4698,
	longitude: 153.0251,
	latitudeDelta: 0.0922,
	longitudeDelta: 0.0421,
}

const BRISBANE_BOUNDS = {
	north: -27.2,
	south: -27.7,
	east: 153.2,
	west: 152.8,
}

// Pure Functions
const isWithinBrisbaneBounds = (lat: number, lon: number): boolean =>
	lat >= BRISBANE_BOUNDS.south && lat <= BRISBANE_BOUNDS.north && lon >= BRISBANE_BOUNDS.west && lon <= BRISBANE_BOUNDS.east

// Sub-Components
const LoadingScreen: React.FC = () => (
	<View style={styles.loadingContainer}>
		<RNActivityIndicator size="large" color="#0000ff" />
		<Text style={styles.loadingText}>Initializing map...</Text>
	</View>
)

const SearchResultsList: React.FC<{
	results: NominatimResult[]
	onSelect: (result: NominatimResult) => void
}> = ({ results, onSelect }) => (
	<View style={styles.searchResults}>
		{results.map((result) => (
			<List.Item
				key={result.place_id}
				title={result.display_name}
				onPress={() => onSelect(result)}
				style={styles.searchResultItem}
				titleNumberOfLines={2}
				titleStyle={styles.searchResultText}
			/>
		))}
	</View>
)

const HistoryModal: React.FC<{
	visible: boolean
	onDismiss: () => void
	history: SearchHistory[]
	onSelect: (item: SearchHistory) => void
}> = ({ visible, onDismiss, history, onSelect }) => (
	<Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.historyModal}>
		<View style={styles.historyModalContainer}>
			<View style={styles.historyHeader}>
				<Text style={styles.historyTitle}>Recent Searches</Text>
				<TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
					<MaterialCommunityIcons name="close" size={24} color={Colors.slate.DEFAULT} />
				</TouchableOpacity>
			</View>

			<View style={styles.historyContent}>
				{history.length === 0 ? (
					<Text style={styles.noHistory}>No recent searches</Text>
				) : (
					<ScrollView style={styles.historyScroll} showsVerticalScrollIndicator={true} contentContainerStyle={styles.historyScrollContent}>
						{history.map((item) => (
							<TouchableOpacity key={item.id} style={styles.historyItem} onPress={() => onSelect(item)}>
								<MaterialCommunityIcons name="map-marker" size={24} color={Colors.slate.DEFAULT} />
								<View style={styles.historyItemContent}>
									<Text numberOfLines={2} style={styles.historyAddress}>
										{item.address}
									</Text>
									<Text style={styles.historyService}>{item.service}</Text>
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
				)}
			</View>
		</View>
	</Modal>
)

/**
 * SearchScreen Component
 * A complex search interface combining map selection, address search, and service selection.
 */
const SearchScreen: React.FC<SearchScreenProps> = ({ onSearch }) => {
	// State Management
	const [mapState, setMapState] = useState({
		selectedLocation: null as Coordinates | null,
		address: "",
		searchQuery: "",
		service: "" as ServiceType | "",
	})

	const [uiState, setUiState] = useState({
		loading: false,
		error: "",
		locationPermission: false,
		showSearchResults: false,
		isInitializing: true,
		isBottomSheetVisible: false,
		showServiceSelector: false,
		showHistory: false,
		showCompanyResults: false,
	})

	const [searchResults, setSearchResults] = useState<NominatimResult[]>([])
	const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
	const [companySearchResults, setCompanySearchResults] = useState<Company[]>([])

	// Refs
	const mapRef = useRef<MapView | null>(null)
	const bottomSheetRef = useRef<BottomSheet | null>(null)
	const snapPoints = ["40%"]

	const [loadingStates, setLoadingStates] = useState({
		addressSearch: false,
		companySearch: false,
		initialization: true,
		locationUpdate: false,
	})

	// Helper function to update loading states
	const updateLoadingState = (key: keyof typeof loadingStates, value: boolean) => {
		setLoadingStates((prev) => ({ ...prev, [key]: value }))
	}

	// Location Services
	const requestLocationPermission = useCallback(async () => {
		try {
			let { status } = await Location.getForegroundPermissionsAsync()

			if (status !== "granted") {
				const { status: newStatus } = await Location.requestForegroundPermissionsAsync()
				if (newStatus !== "granted") {
					setUiState((prev) => ({
						...prev,
						error: "Location permission is required for better experience",
					}))
					mapRef.current?.animateToRegion(BRISBANE_REGION)
					return
				}
				status = newStatus
			}

			setUiState((prev) => ({ ...prev, locationPermission: true, loading: true }))

			const location = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
			})

			const { latitude, longitude } = location.coords

			if (isWithinBrisbaneBounds(latitude, longitude)) {
				await handleLocationUpdate({ latitude, longitude })
			} else {
				setUiState((prev) => ({
					...prev,
					error: "Your current location is outside Brisbane",
				}))
				mapRef.current?.animateToRegion(BRISBANE_REGION)
			}
		} catch (err) {
			console.error("Location permission error:", err)
			setUiState((prev) => ({
				...prev,
				error: "Unable to access location services",
			}))
			mapRef.current?.animateToRegion(BRISBANE_REGION)
		} finally {
			setUiState((prev) => ({ ...prev, loading: false }))
		}
	}, [])

	// History Management
	const loadSearchHistory = useCallback(async () => {
		try {
			const history = await AsyncStorage.getItem("searchHistory")
			if (history) {
				setSearchHistory(JSON.parse(history))
			}
		} catch (err) {
			console.error("Error loading search history:", err)
			setUiState((prev) => ({
				...prev,
				error: "Failed to load search history",
			}))
		}
	}, [])

	const saveToHistory = useCallback(
		async (searchData: Omit<SearchHistory, "id" | "timestamp">) => {
			try {
				const newHistory: SearchHistory = {
					...searchData,
					id: Math.random().toString(36).substr(2, 9),
					timestamp: Date.now(),
				}

				const updatedHistory = [newHistory, ...searchHistory.slice(0, 9)]
				await AsyncStorage.setItem("searchHistory", JSON.stringify(updatedHistory))
				setSearchHistory(updatedHistory)
			} catch (err) {
				console.error("Error saving search history:", err)
				setUiState((prev) => ({ ...prev, error: "Failed to save to history" }))
			}
		},
		[searchHistory]
	)

	// Search Handlers
	const searchAddress = useCallback(
		debounce(async (query: string): Promise<void> => {
			if (query.length < 3) {
				setSearchResults([])
				return
			}

			try {
				setUiState((prev) => ({ ...prev, loading: true }))

				const response = await fetch(
					`https://nominatim.openstreetmap.org/search?` +
						`format=json&q=${encodeURIComponent(query)}&` +
						`viewbox=${BRISBANE_BOUNDS.west},${BRISBANE_BOUNDS.south},` +
						`${BRISBANE_BOUNDS.east},${BRISBANE_BOUNDS.north}&` +
						`bounded=1&countrycodes=au&limit=5`,
					{
						headers: {
							"Accept-Language": "en",
							"User-Agent": "LocalPagesApp/1.0",
						},
					}
				)

				if (!response.ok) throw new Error("Failed to fetch address results")

				const data: NominatimResult[] = await response.json()
				setSearchResults(data)
				setUiState((prev) => ({ ...prev, showSearchResults: true }))
			} catch (err) {
				console.error("Error searching address:", err)
				setUiState((prev) => ({
					...prev,
					error: "Error searching for address",
				}))
			} finally {
				setUiState((prev) => ({ ...prev, loading: false }))
			}
		}, 500),
		[]
	)

	// Location Update Handler
	const handleLocationUpdate = async (coordinate: Coordinates) => {
		try {
			updateLoadingState("locationUpdate", true)
			setMapState((prev) => ({ ...prev, selectedLocation: coordinate }))

			mapRef.current?.animateToRegion({
				...coordinate,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			})

			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?` + `format=json&lat=${coordinate.latitude}&lon=${coordinate.longitude}`,
				{
					headers: {
						"Accept-Language": "en",
						"User-Agent": "LocalPagesApp/1.0",
					},
				}
			)

			if (!response.ok) throw new Error("Failed to get address details")

			const data = await response.json()
			if (data.display_name) {
				setMapState((prev) => ({
					...prev,
					address: data.display_name,
					searchQuery: data.display_name,
				}))
				setUiState((prev) => ({ ...prev, isBottomSheetVisible: true }))
				bottomSheetRef.current?.expand()
			}
		} catch (err) {
			console.error("Error updating location:", err)
			setUiState((prev) => ({
				...prev,
				error: "Error getting address details",
			}))
		} finally {
			updateLoadingState("locationUpdate", false)
		}
	}

	// Event Handlers
	const handleMapPress = (event: MapPressEvent) => {
		const coordinate = event.nativeEvent.coordinate
		if (!isWithinBrisbaneBounds(coordinate.latitude, coordinate.longitude)) {
			setUiState((prev) => ({
				...prev,
				error: "Please select a location within Brisbane",
			}))
			return
		}
		handleLocationUpdate(coordinate)
	}

	const handleCompanySearch = async () => {
		if (!mapState.selectedLocation || !mapState.service) {
			setUiState((prev) => ({
				...prev,
				error: "Please select both location and service",
			}))
			return
		}

		setUiState((prev) => ({ ...prev, loading: true }))

		try {
			const { companies, error } = await searchServiceAreas({
				location: mapState.selectedLocation,
				service: mapState.service as ServiceCategoryKey,
				radius: 0,
			})

			if (error) {
				throw error
			}

			if (!companies || companies.length === 0) {
				setUiState((prev) => ({
					...prev,
					error: "No companies found in this area",
					showCompanyResults: false,
				}))
				setCompanySearchResults([])
				return
			}

			await saveToHistory({
				address: mapState.address,
				service: mapState.service as ServiceCategoryKey,
				location: mapState.selectedLocation,
			})

			setCompanySearchResults(companies)
			setUiState((prev) => ({ ...prev, showCompanyResults: true }))
		} catch (err) {
			console.error("Search error:", err)
			setUiState((prev) => ({
				...prev,
				error: err instanceof Error ? err.message : "Error searching for companies",
			}))
			setCompanySearchResults([])
		} finally {
			setUiState((prev) => ({ ...prev, loading: false }))
		}
	}

	// Effects
	useEffect(() => {
		const initialize = async () => {
			try {
				await Promise.all([requestLocationPermission(), loadSearchHistory()])
			} catch (err) {
				console.error("Initialization error:", err)
				setUiState((prev) => ({ ...prev, error: "Failed to initialize app" }))
			} finally {
				setUiState((prev) => ({ ...prev, isInitializing: false }))
			}
		}

		initialize()
	}, [])

	if (uiState.isInitializing) return <LoadingScreen />

	return (
		<ErrorBoundary>
			<GestureHandlerRootView style={styles.container}>
				<View style={styles.container}>
					<MapView
						ref={mapRef}
						style={styles.map}
						initialRegion={BRISBANE_REGION}
						onPress={handleMapPress}
						showsUserLocation={uiState.locationPermission}
						showsMyLocationButton={uiState.locationPermission}
					>
						{mapState.selectedLocation && (
							<Marker coordinate={mapState.selectedLocation} tracksViewChanges={false}>
								<CustomMarker size={40} />
							</Marker>
						)}
					</MapView>

					{/* Guide message */}
					{!mapState.selectedLocation && (
						<View style={styles.guideContainer}>
							<MaterialCommunityIcons name="map-marker-plus" size={24} color={Colors.blue.DEFAULT} />
							<Text style={styles.guideText}>Tap anywhere to start searching</Text>
						</View>
					)}

					{uiState.isBottomSheetVisible && (
						<BottomSheet
							ref={bottomSheetRef}
							snapPoints={snapPoints}
							enablePanDownToClose={false}
							index={0}
							style={styles.bottomSheet}
							handleIndicatorStyle={styles.bottomSheetIndicator}
						>
							<BottomSheetView style={styles.bottomSheetContent}>
								<View style={styles.searchSection}>
									<View style={styles.searchRow}>
										<TextInput
											mode="outlined"
											placeholder="Search for an address in Brisbane"
											value={mapState.searchQuery}
											onChangeText={(text) => {
												setMapState((prev) => ({
													...prev,
													searchQuery: text,
												}))
												searchAddress(text)
											}}
											right={uiState.loading ? <TextInput.Icon icon="loading" /> : null}
											style={styles.searchInput}
										/>
										<TouchableOpacity
											style={styles.historyButton}
											onPress={() =>
												setUiState((prev) => ({
													...prev,
													showHistory: true,
												}))
											}
										>
											<MaterialCommunityIcons name="history" size={24} color={Colors.blue.DEFAULT} />
										</TouchableOpacity>
									</View>

									{uiState.showSearchResults && searchResults.length > 0 && (
										<SearchResultsList
											results={searchResults}
											onSelect={(result) => {
												const newLocation = {
													latitude: parseFloat(result.lat),
													longitude: parseFloat(result.lon),
												}
												handleLocationUpdate(newLocation)
												setUiState((prev) => ({
													...prev,
													showSearchResults: false,
												}))
											}}
										/>
									)}
								</View>

								<View style={styles.divider} />

								<ServiceSelector
									value={mapState.service}
									onSelect={(value) =>
										setMapState((prev) => ({
											...prev,
											service: value,
										}))
									}
									visible={uiState.showServiceSelector}
									onDismiss={() =>
										setUiState((prev) => ({
											...prev,
											showServiceSelector: false,
										}))
									}
									onShow={() =>
										setUiState((prev) => ({
											...prev,
											showServiceSelector: true,
										}))
									}
								/>

								<View style={styles.buttonContainer}>
									<Button
										mode="contained"
										onPress={handleCompanySearch}
										loading={uiState.loading}
										disabled={uiState.loading || !mapState.address || !mapState.service}
										style={styles.primaryButton}
										icon="magnify"
									>
										Find Companies
									</Button>

									<Button
										mode="outlined"
										onPress={async () => {
											if (!mapState.selectedLocation || !mapState.service) {
												setUiState((prev) => ({
													...prev,
													error: "Please select both location and service",
												}))
												return
											}

											await onSearch?.({
												address: mapState.address,
												service: mapState.service as ServiceCategoryKey,
												location: mapState.selectedLocation,
												query: mapState.searchQuery,
											})
										}}
										loading={uiState.loading}
										disabled={uiState.loading || !mapState.address || !mapState.service}
										style={styles.secondaryButton}
									>
										Save Location
									</Button>
								</View>
							</BottomSheetView>
						</BottomSheet>
					)}

					<HistoryModal
						visible={uiState.showHistory}
						onDismiss={() =>
							setUiState((prev) => ({
								...prev,
								showHistory: false,
							}))
						}
						history={searchHistory}
						onSelect={(historyItem) => {
							setMapState({
								selectedLocation: historyItem.location,
								address: historyItem.address,
								searchQuery: historyItem.address,
								service: historyItem.service,
							})
							mapRef.current?.animateToRegion({
								...historyItem.location,
								latitudeDelta: 0.0922,
								longitudeDelta: 0.0421,
							})
							setUiState((prev) => ({
								...prev,
								isBottomSheetVisible: true,
								showHistory: false,
							}))
						}}
					/>

					{uiState.loading && (
						<Portal>
							<Modal visible={uiState.loading} dismissable={false} contentContainerStyle={styles.loadingModal}>
								<RNActivityIndicator size="large" color="#0000ff" />
							</Modal>
						</Portal>
					)}

					{uiState.showCompanyResults && (
						<Portal>
							<Modal
								visible={uiState.showCompanyResults}
								onDismiss={() =>
									setUiState((prev) => ({
										...prev,
										showCompanyResults: false,
									}))
								}
								contentContainerStyle={styles.resultsModal}
								dismissable={true}
							>
								<CompanyList
									companies={companySearchResults}
									onClose={() =>
										setUiState((prev) => ({
											...prev,
											showCompanyResults: false,
										}))
									}
								/>
							</Modal>
						</Portal>
					)}

					<Snackbar
						visible={!!uiState.error}
						onDismiss={() => setUiState((prev) => ({ ...prev, error: "" }))}
						duration={3000}
						action={{
							label: "OK",
							onPress: () => setUiState((prev) => ({ ...prev, error: "" })),
						}}
					>
						{uiState.error}
					</Snackbar>
				</View>
			</GestureHandlerRootView>
		</ErrorBoundary>
	)
}

// Styles
const styles = StyleSheet.create({
	guideContainer: {
		position: "absolute",
		top: Platform.OS === "ios" ? 60 : 40,
		left: 20,
		right: 20,
		backgroundColor: Colors.white,
		padding: 12,
		borderRadius: 8,
		flexDirection: "row",
		alignItems: "center",
		shadowColor: Colors.darks.darkest,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	guideText: {
		flex: 1,
		fontSize: 16,
		color: Colors.dark_blue.DEFAULT,
		marginLeft: 8,
	},
	guideIcon: {
		width: 24,
		height: 24,
	},
	historyModal: {
		margin: 20,
		maxHeight: "80%",
		width: "90%",
		alignSelf: "center",
	},
	historyModalContainer: {
		backgroundColor: Colors.white,
		borderRadius: 8,
		elevation: 5,
		shadowColor: Colors.darks.darkest,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	historyHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: Colors.blue.lightest,
	},
	historyTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: Colors.dark_blue.DEFAULT,
	},
	closeButton: {
		padding: 4,
	},
	historyContent: {
		maxHeight: "80%",
	},
	historyScroll: {
		flexGrow: 0,
	},
	historyScrollContent: {
		flexGrow: 1,
	},
	noHistory: {
		textAlign: "center",
		color: Colors.slate.DEFAULT,
		padding: 20,
	},
	historyItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: Colors.blue.lightest,
	},
	historyItemContent: {
		marginLeft: 12,
		flex: 1,
	},
	historyAddress: {
		fontSize: 16,
		color: Colors.dark_blue.DEFAULT,
		lineHeight: 22,
	},
	historyService: {
		fontSize: 14,
		color: Colors.slate.DEFAULT,
		marginTop: 4,
	},
	searchSection: {
		marginBottom: 16,
	},
	searchRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 8,
	},
	searchInput: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	divider: {
		height: 1,
		backgroundColor: Colors.blue.lightest,
		marginVertical: 16,
	},
	buttonContainer: {
		gap: 12,
		marginTop: 16,
	},
	primaryButton: {
		backgroundColor: Colors.blue.DEFAULT,
		paddingVertical: 8,
	},
	secondaryButton: {
		borderColor: Colors.blue.DEFAULT,
		borderWidth: 2,
	},
	bottomSheetContent: {
		flex: 1,
		padding: 16,
		backgroundColor: Colors.white,
	},

	container: {
		flex: 1,
		backgroundColor: Colors.offwhite,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "transparent",
	},
	loadingModal: {
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		padding: 20,
		borderRadius: 60,
		alignItems: "center",
		alignSelf: "center",
		width: 80,
		height: 80,
		justifyContent: "center",
	},
	loadingText: {
		marginTop: 10,
		fontSize: 14,
		color: Colors.dark_blue.DEFAULT,
		textAlign: "center",
	},
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
	searchContainer: {
		position: "absolute",
		top: 0,
		width: "100%",
		padding: 10,
		zIndex: 1,
	},
	historyButton: {
		width: 44,
		height: 44,
		backgroundColor: Colors.white,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		elevation: 2,
		shadowColor: Colors.darks.darkest,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
	},
	searchResults: {
		backgroundColor: Colors.white,
		borderRadius: 8,
		marginTop: 8,
		maxHeight: 200,
		overflow: "scroll",
		elevation: 3,
		shadowColor: Colors.darks.darkest,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	searchResultItem: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.blue.lightest,
		paddingVertical: 8,
	},
	searchResultText: {
		fontSize: 14,
		color: Colors.dark_blue.DEFAULT,
		lineHeight: 20,
	},
	bottomSheet: {
		backgroundColor: Colors.white,
		shadowColor: Colors.darks.darkest,
		shadowOffset: {
			width: 0,
			height: -4,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	bottomSheetIndicator: {
		width: 40,
		height: 4,
		backgroundColor: Colors.blue.DEFAULT,
		alignSelf: "center",
		marginTop: 8,
	},
	input: {
		marginBottom: 16,
		backgroundColor: Colors.offwhite,
	},
	button: {
		flex: 1,
		marginHorizontal: 4,
	},
	saveButton: {
		backgroundColor: Colors.blue.DEFAULT,
	},
	searchButton: {
		backgroundColor: Colors.blue.dark,
	},
	resultsModal: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "white",
		margin: 0,
		padding: 0,
		height: SCREEN_HEIGHT,
	},
})

export default SearchScreen
