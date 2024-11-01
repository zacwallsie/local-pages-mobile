import React, { useState, useRef } from "react"
import { View, StyleSheet, Dimensions, ActivityIndicator, Image, TouchableOpacity } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import MapView, { Geojson } from "react-native-maps"
import { Text, Portal, Modal, Card, Button, IconButton } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { ServiceSelector } from "@/components/common/ServiceSelector"
import { Colors } from "@/constants/Colors"
import { ServiceCategoryKey, Company, ServiceArea } from "@/types/supabase"
import { fetchServiceAreas } from "@/utils/fetchServiceAreas"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

// Brisbane region constants
const BRISBANE_REGION = {
	latitude: -27.4698,
	longitude: 153.0251,
	latitudeDelta: 0.922,
	longitudeDelta: 0.421,
}

interface ServiceAreasViewProps {
	onServiceSelect?: (service: ServiceCategoryKey) => void
}

interface ServiceAreaWithCompany extends ServiceArea {
	company: Company
}

const ServiceAreaPopover = ({ company, onClose }: { company: Company; onClose: () => void }) => {
	const handleViewCompany = () => {
		// First close the popover
		onClose()

		// Then navigate to company details
		setTimeout(() => {
			router.push({
				pathname: "/companies/[id]",
				params: { id: company.id, company: JSON.stringify(company) },
			})
		}, 100)
	}

	return (
		<Card style={styles.popoverCard}>
			<Card.Content style={styles.popoverContent}>
				<View style={styles.popoverHeader}>
					<Text variant="titleMedium" style={styles.companyName}>
						Service Area Details
					</Text>
					<IconButton icon="close" size={24} onPress={onClose} style={styles.closeButton} />
				</View>

				<View style={styles.companyDetails}>
					<View style={styles.logoContainer}>
						{company.logo ? (
							<Image source={{ uri: company.logo }} style={styles.logo} resizeMode="cover" />
						) : (
							<View style={styles.placeholderLogo}>
								<MaterialCommunityIcons name="domain" size={30} color={Colors.blue.DEFAULT} />
							</View>
						)}
					</View>

					<View style={styles.infoContainer}>
						<Text variant="titleMedium" style={styles.companyName}>
							{company.company_name}
						</Text>
						{company.description && (
							<Text variant="bodySmall" style={styles.description} numberOfLines={2}>
								{company.description}
							</Text>
						)}
					</View>
				</View>

				<Button mode="contained" onPress={handleViewCompany} style={styles.viewButton}>
					View Company Details
				</Button>
			</Card.Content>
		</Card>
	)
}

const ServiceAreasView = ({ onServiceSelect }: ServiceAreasViewProps) => {
	const insets = useSafeAreaInsets()
	const mapRef = useRef<MapView | null>(null)

	const [selectedService, setSelectedService] = useState<ServiceCategoryKey | "">("")
	const [serviceAreas, setServiceAreas] = useState<ServiceAreaWithCompany[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [showServiceSelector, setShowServiceSelector] = useState(false)
	const [selectedArea, setSelectedArea] = useState<ServiceAreaWithCompany | null>(null)

	// Handle service selection
	const handleServiceSelect = async (service: ServiceCategoryKey) => {
		setSelectedService(service)
		onServiceSelect?.(service)
		setLoading(true)
		setError("")

		try {
			const { serviceAreas: areas, error: fetchError } = await fetchServiceAreas({ service })

			if (fetchError) {
				throw fetchError
			}

			setServiceAreas(areas)
		} catch (err) {
			console.error("Error fetching service areas:", err)
			setError("Failed to load service areas")
		} finally {
			setLoading(false)
		}
	}

	// Handle GeoJSON feature press
	const handleAreaPress = (area: ServiceAreaWithCompany) => {
		setSelectedArea(area)
	}

	return (
		<GestureHandlerRootView style={styles.container}>
			<View style={styles.container}>
				<MapView ref={mapRef} style={styles.map} initialRegion={BRISBANE_REGION}>
					{serviceAreas.map((area) => (
						<Geojson
							key={area.id}
							geojson={area.geojson as GeoJSON.FeatureCollection}
							strokeColor={Colors.blue.DEFAULT}
							fillColor={`${Colors.blue.DEFAULT}50`}
							strokeWidth={2}
							tappable
							onPress={() => handleAreaPress(area)}
						/>
					))}
				</MapView>

				{/* Service Selector */}
				<View style={[styles.selectorContainer, { marginTop: insets.top + 20 }]}>
					<ServiceSelector
						value={selectedService}
						onSelect={handleServiceSelect}
						visible={showServiceSelector}
						onDismiss={() => setShowServiceSelector(false)}
						onShow={() => setShowServiceSelector(true)}
						style={{ backgroundColor: Colors.white }}
					/>
				</View>

				{/* Selected Area Popover */}
				{selectedArea && (
					<View style={[styles.popoverContainer, { marginBottom: insets.bottom + 20 }]}>
						<ServiceAreaPopover company={selectedArea.company} onClose={() => setSelectedArea(null)} />
					</View>
				)}

				{/* Loading Indicator */}
				{loading && (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={Colors.blue.DEFAULT} />
					</View>
				)}
			</View>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	popoverContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: 16,
		backgroundColor: "transparent",
	},
	popoverCard: {
		elevation: 4,
		backgroundColor: Colors.white,
		borderRadius: 12,
	},
	popoverContent: {
		padding: 16,
	},
	popoverHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	companyDetails: {
		flexDirection: "row",
		marginBottom: 16,
	},
	logoContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		overflow: "hidden",
		backgroundColor: Colors.blue.lightest,
		justifyContent: "center",
		alignItems: "center",
	},
	logo: {
		width: "100%",
		height: "100%",
	},
	placeholderLogo: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.blue.lightest,
	},
	infoContainer: {
		flex: 1,
		marginLeft: 12,
	},
	companyName: {
		color: Colors.dark_blue.DEFAULT,
		fontWeight: "600",
		marginBottom: 4,
	},
	description: {
		color: Colors.slate.DEFAULT,
		fontSize: 14,
	},
	viewButton: {
		marginTop: 8,
		backgroundColor: Colors.blue.DEFAULT,
	},
	closeButton: {
		margin: -8,
	},
	container: {
		flex: 1,
		backgroundColor: Colors.offwhite,
	},
	map: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
	},
	selectorContainer: {
		position: "absolute",
		left: 20,
		right: 20,
		backgroundColor: Colors.white,
		borderRadius: 8,
		elevation: 4,
		shadowColor: Colors.darks.darkest,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	loadingContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.7)",
	},
	errorContainer: {
		position: "absolute",
		bottom: 20,
		left: 20,
		right: 20,
		backgroundColor: Colors.white,
		padding: 10,
		borderRadius: 8,
		elevation: 4,
		shadowColor: Colors.darks.darkest,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	errorText: {
		color: "red",
		textAlign: "center",
	},
	modalContent: {
		margin: 20,
		backgroundColor: Colors.white,
		borderRadius: 8,
	},
	cardContent: {
		gap: 8,
	},
	contactInfo: {
		fontSize: 14,
		color: Colors.slate.DEFAULT,
	},
})

export default ServiceAreasView
