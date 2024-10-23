import React, { useState, useRef, useEffect, useCallback } from "react"
import { View, StyleSheet, Dimensions, ActivityIndicator as RNActivityIndicator, TouchableOpacity } from "react-native"
import MapView, { Marker, Region, MapPressEvent } from "react-native-maps"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { TextInput, Button, Text, Snackbar, List, Portal, Modal } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as Location from "expo-location"
import AsyncStorage from "@react-native-async-storage/async-storage"
import debounce from "lodash/debounce"
import { ErrorBoundary } from "./ErrorBoundary"
import { ServiceSelector } from "./ServiceSelector"
import { Colors } from "@/constants/Colors"
import { CustomMarker } from "./CustomMarker"

// Types and Interfaces
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

// Constants
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

const SERVICES = ["Plumbing", "Electrical", "Cleaning", "Gardening", "Painting"] as const

type ServiceType = (typeof SERVICES)[number]

interface SearchScreenProps {
	onSearch?: (params: { address: string; service: ServiceType; location: Coordinates; query?: string }) => Promise<void>
	onCompanySearch?: (params: { service: ServiceType; location: Coordinates; radius?: number }) => Promise<void>
}

function SearchScreen({ onSearch, onCompanySearch }: SearchScreenProps) {
	// State
	const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null)
	const [address, setAddress] = useState<string>("")
	const [searchResults, setSearchResults] = useState<NominatimResult[]>([])
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [service, setService] = useState<ServiceType | "">("")
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>("")
	const [locationPermission, setLocationPermission] = useState<boolean>(false)
	const [showSearchResults, setShowSearchResults] = useState<boolean>(false)
	const [isInitializing, setIsInitializing] = useState(true)
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false)
	const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
	const [showServiceSelector, setShowServiceSelector] = useState(false)
	const [showHistory, setShowHistory] = useState(false)

	// Refs
	const mapRef = useRef<MapView | null>(null)
	const bottomSheetRef = useRef<BottomSheet | null>(null)
	const snapPoints = ["40%"]
	const insets = useSafeAreaInsets()

	// Effects
	useEffect(() => {
		const initialize = async () => {
			try {
				await requestLocationPermission()
				await loadSearchHistory()
			} catch (err) {
				console.error("Initialization error:", err)
				setError("Failed to initialize app")
			} finally {
				setIsInitializing(false)
			}
		}

		initialize()
	}, [])

	// Helper Functions
	const requestLocationPermission = async (): Promise<void> => {
		try {
			const { status } = await Location.requestForegroundPermissionsAsync()
			setLocationPermission(status === "granted")

			if (status === "granted") {
				const location = await Location.getCurrentPositionAsync({})
				const { latitude, longitude } = location.coords

				if (isWithinBrisbaneBounds(latitude, longitude)) {
					mapRef.current?.animateToRegion({
						latitude,
						longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					})
				}
			}
		} catch (err) {
			console.warn("Error getting location:", err)
			setError("Unable to access location services")
		}
	}

	const isWithinBrisbaneBounds = (lat: number, lon: number): boolean => {
		return lat >= BRISBANE_BOUNDS.south && lat <= BRISBANE_BOUNDS.north && lon >= BRISBANE_BOUNDS.west && lon <= BRISBANE_BOUNDS.east
	}

	const loadSearchHistory = async () => {
		try {
			const history = await AsyncStorage.getItem("searchHistory")
			if (history) {
				setSearchHistory(JSON.parse(history))
			}
		} catch (err) {
			console.error("Error loading search history:", err)
			setError("Failed to load search history")
		}
	}

	const saveToHistory = async (searchData: Omit<SearchHistory, "id" | "timestamp">) => {
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
			setError("Failed to save to history")
		}
	}

	// Event Handlers
	const showBottomSheet = useCallback(() => {
		setIsBottomSheetVisible(true)
		bottomSheetRef.current?.expand()
	}, [])

	const searchAddress = debounce(async (query: string): Promise<void> => {
		if (query.length < 3) {
			setSearchResults([])
			return
		}

		try {
			setLoading(true)
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?` +
					`format=json&q=${encodeURIComponent(query)}&` +
					`viewbox=${BRISBANE_BOUNDS.west},${BRISBANE_BOUNDS.south},${BRISBANE_BOUNDS.east},${BRISBANE_BOUNDS.north}&` +
					`bounded=1&countrycodes=au&limit=5`,
				{
					headers: {
						"Accept-Language": "en",
						"User-Agent": "LocalPagesApp/1.0",
					},
				}
			)

			if (!response.ok) {
				throw new Error("Failed to fetch address results")
			}

			const data: NominatimResult[] = await response.json()
			setSearchResults(data)
			setShowSearchResults(true)
		} catch (err) {
			console.error("Error searching address:", err)
			setError("Error searching for address")
		} finally {
			setLoading(false)
		}
	}, 500)

	const handleLocationSelect = async (result: NominatimResult): Promise<void> => {
		const newLocation: Coordinates = {
			latitude: parseFloat(result.lat),
			longitude: parseFloat(result.lon),
		}

		setSelectedLocation(newLocation)
		setAddress(result.display_name)
		setSearchQuery(result.display_name)
		setShowSearchResults(false)

		mapRef.current?.animateToRegion({
			...newLocation,
			latitudeDelta: 0.0922,
			longitudeDelta: 0.0421,
		})

		showBottomSheet()
	}

	const handleMapPress = async (event: MapPressEvent): Promise<void> => {
		const coordinate = event.nativeEvent.coordinate
		if (!isWithinBrisbaneBounds(coordinate.latitude, coordinate.longitude)) {
			setError("Please select a location within Brisbane")
			return
		}

		setSelectedLocation(coordinate)
		setLoading(true)

		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?` + `format=json&lat=${coordinate.latitude}&lon=${coordinate.longitude}`,
				{
					headers: {
						"Accept-Language": "en",
						"User-Agent": "LocalPagesApp/1.0",
					},
				}
			)

			if (!response.ok) {
				throw new Error("Failed to get address details")
			}

			const data = await response.json()
			if (data.display_name) {
				setAddress(data.display_name)
				setSearchQuery(data.display_name)
				showBottomSheet()
			}
		} catch (err) {
			console.error("Error reverse geocoding:", err)
			setError("Error getting address details")
		} finally {
			setLoading(false)
		}
	}

	const handleHistorySelect = (historyItem: SearchHistory) => {
		setSelectedLocation(historyItem.location)
		setAddress(historyItem.address)
		setService(historyItem.service)
		mapRef.current?.animateToRegion({
			...historyItem.location,
			latitudeDelta: 0.0922,
			longitudeDelta: 0.0421,
		})
		showBottomSheet()
		setShowHistory(false)
	}

	const handleSearch = async (): Promise<void> => {
		if (!selectedLocation || !service) {
			setError("Please select both location and service")
			return
		}

		setLoading(true)
		setError("")

		try {
			await onSearch?.({
				address,
				service,
				location: selectedLocation,
				query: searchQuery,
			})

			await saveToHistory({
				address,
				service,
				location: selectedLocation,
			})
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred during search")
		} finally {
			setLoading(false)
		}
	}

	const handleCompanySearch = async (): Promise<void> => {
		if (!selectedLocation || !service) {
			setError("Please select both location and service")
			return
		}

		setLoading(true)
		try {
			await onCompanySearch?.({
				service,
				location: selectedLocation,
				radius: 10, // 10km radius
			})
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error searching for companies")
		} finally {
			setLoading(false)
		}
	}

	// Loading Screen
	if (isInitializing) {
		return (
			<View style={styles.loadingContainer}>
				<RNActivityIndicator size="large" color="#0000ff" />
				<Text style={styles.loadingText}>Initializing map...</Text>
			</View>
		)
	}

	return (
		<ErrorBoundary>
			<GestureHandlerRootView style={styles.container}>
				<View style={styles.container}>
					<MapView
						ref={mapRef}
						style={styles.map}
						initialRegion={BRISBANE_REGION}
						onPress={handleMapPress}
						showsUserLocation={locationPermission}
						showsMyLocationButton={locationPermission}
					>
						{selectedLocation && (
							<Marker coordinate={selectedLocation} tracksViewChanges={false}>
								<CustomMarker size={40} />
							</Marker>
						)}
					</MapView>

					{/* Search Container */}
					<View style={[styles.searchContainer, { paddingTop: insets.top }]}>
						<View style={styles.searchRow}>
							<TextInput
								mode="outlined"
								placeholder="Search for an address in Brisbane"
								value={searchQuery}
								onChangeText={(text) => {
									setSearchQuery(text)
									searchAddress(text)
								}}
								right={loading ? <TextInput.Icon icon="loading" /> : null}
								style={styles.searchInput}
							/>
							<TouchableOpacity style={styles.historyButton} onPress={() => setShowHistory(true)}>
								<MaterialCommunityIcons name="history" size={24} color={Colors.blue.DEFAULT} />
							</TouchableOpacity>
						</View>

						{showSearchResults && searchResults.length > 0 && (
							<View style={styles.searchResults}>
								{searchResults.map((result) => (
									<List.Item
										key={result.place_id}
										title={result.display_name}
										onPress={() => handleLocationSelect(result)}
										style={styles.searchResultItem}
										titleNumberOfLines={2}
										titleStyle={styles.searchResultText}
									/>
								))}
							</View>
						)}
					</View>

					{/* History Button */}
					<TouchableOpacity style={[styles.historyButton, { top: insets.top + 10 }]} onPress={() => setShowHistory(true)}>
						<MaterialCommunityIcons name="history" size={24} color="white" />
					</TouchableOpacity>

					{/* History Modal */}
					<Portal>
						<Modal visible={showHistory} onDismiss={() => setShowHistory(false)} contentContainerStyle={styles.historyModal}>
							<Text style={styles.historyTitle}>Recent Searches</Text>
							{searchHistory.length === 0 ? (
								<Text style={styles.noHistory}>No recent searches</Text>
							) : (
								searchHistory.map((item) => (
									<TouchableOpacity key={item.id} style={styles.historyItem} onPress={() => handleHistorySelect(item)}>
										<MaterialCommunityIcons name="map-marker" size={24} color="#666" />
										<View style={styles.historyItemContent}>
											<Text numberOfLines={1} style={styles.historyAddress}>
												{item.address}
											</Text>
											<Text style={styles.historyService}>{item.service}</Text>
										</View>
									</TouchableOpacity>
								))
							)}
						</Modal>
					</Portal>

					{/* Bottom Sheet */}
					{isBottomSheetVisible && (
						<BottomSheet
							ref={bottomSheetRef}
							snapPoints={snapPoints}
							enablePanDownToClose={false}
							index={0}
							style={styles.bottomSheet}
							handleIndicatorStyle={styles.bottomSheetIndicator}
						>
							<BottomSheetView style={styles.bottomSheetContent}>
								<TextInput label="Selected Address" value={address} style={styles.input} mode="outlined" disabled />

								<ServiceSelector
									value={service}
									onSelect={(value) => setService(value as ServiceType)}
									services={SERVICES}
									visible={showServiceSelector}
									onDismiss={() => setShowServiceSelector(false)}
									onShow={() => setShowServiceSelector(true)}
								/>

								<View style={styles.buttonContainer}>
									<Button
										mode="contained"
										onPress={handleSearch}
										loading={loading}
										disabled={loading || !address || !service}
										style={[styles.button, styles.saveButton]}
									>
										Save Location
									</Button>

									<Button
										mode="contained"
										onPress={handleCompanySearch}
										loading={loading}
										disabled={loading || !address || !service}
										style={[styles.button, styles.searchButton]}
										icon="magnify"
									>
										Find Companies
									</Button>
								</View>
							</BottomSheetView>
						</BottomSheet>
					)}

					{/* Loading Modal */}
					{loading && (
						<Portal>
							<Modal visible={loading} dismissable={false} contentContainerStyle={styles.loadingModal}>
								<RNActivityIndicator size="large" color="#0000ff" />
								<Text style={styles.loadingText}>Loading...</Text>
							</Modal>
						</Portal>
					)}

					{/* Error Snackbar */}
					<Snackbar
						visible={!!error}
						onDismiss={() => setError("")}
						duration={3000}
						action={{
							label: "OK",
							onPress: () => setError(""),
						}}
					>
						{error}
					</Snackbar>
				</View>
			</GestureHandlerRootView>
		</ErrorBoundary>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.offwhite,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.white,
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16,
		color: Colors.dark_blue.DEFAULT,
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
	searchRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	searchInput: {
		flex: 1,
		backgroundColor: Colors.white,
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
	historyModal: {
		backgroundColor: Colors.white,
		margin: 20,
		padding: 20,
		borderRadius: 8,
		maxHeight: "80%",
	},
	historyTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: Colors.dark_blue.DEFAULT,
		marginBottom: 16,
	},
	noHistory: {
		textAlign: "center",
		color: Colors.slate.DEFAULT,
		marginTop: 20,
	},
	historyItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
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
	},
	historyService: {
		fontSize: 14,
		color: Colors.slate.DEFAULT,
		marginTop: 4,
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
	bottomSheetContent: {
		flex: 1,
		padding: 16,
		backgroundColor: Colors.white,
	},
	input: {
		marginBottom: 16,
		backgroundColor: Colors.offwhite,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
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
	loadingModal: {
		backgroundColor: Colors.white,
		padding: 20,
		margin: 40,
		borderRadius: 8,
		alignItems: "center",
	},
})

export default SearchScreen
