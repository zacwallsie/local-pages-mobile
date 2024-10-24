import React, { useState, useCallback } from "react"
import { View, StyleSheet, ScrollView, ActivityIndicator as RNActivityIndicator, RefreshControl } from "react-native"
import { TextInput, Button, Text, Chip, Avatar, Card, Searchbar, Portal, Modal } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import debounce from "lodash/debounce"
import { ErrorBoundary } from "@/components/utils/ErrorBoundary"
import { Colors } from "@/constants/Colors"
import { ServiceCategory } from "@/types/supabase"

// Types and Interfaces
type ServiceType = keyof typeof ServiceCategory

interface Company {
	id: string
	name: string
	description: string
	services: ServiceType[]
	rating: number
	reviewCount: number
	location: string
	profileImage?: string
}

interface CompanyListScreenProps {
	onCompanySelect?: (companyId: string) => void
}

// Get all services from ServiceCategory
const SERVICES = Object.entries(ServiceCategory).map(([key, value]) => ({
	key: key as ServiceType,
	...value,
}))

// Helper function to get icon for service
const getServiceIcon = (service: ServiceType): string => {
	const icons: Record<ServiceType, string> = {
		HOME_SERVICES: "home",
		PROFESSIONAL_SERVICES: "briefcase",
		HEALTH_AND_WELLNESS: "heart",
		AUTOMOTIVE: "car",
		BEAUTY_AND_PERSONAL_CARE: "scissors-cutting",
		PET_SERVICES: "paw",
		EDUCATION_AND_TUTORING: "school",
		TECHNOLOGY_SERVICES: "laptop",
		EVENT_SERVICES: "party-popper",
		CLEANING_SERVICES: "spray",
		MOVING_AND_STORAGE: "truck",
		FITNESS_AND_RECREATION: "dumbbell",
	}
	return icons[service] || "tools"
}

function CompanyListScreen({ onCompanySelect }: CompanyListScreenProps) {
	// State
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedServices, setSelectedServices] = useState<ServiceType[]>([])
	const [loading, setLoading] = useState(false)
	const [refreshing, setRefreshing] = useState(false)
	const [error, setError] = useState("")
	const [companies, setCompanies] = useState<Company[]>([])
	const insets = useSafeAreaInsets()

	// Search Handler
	const handleSearch = debounce(async (query: string) => {
		setLoading(true)
		try {
			// TODO: Implement Supabase search
			console.log("Searching for:", query, "with services:", selectedServices)
		} catch (err) {
			setError("Failed to search companies")
			console.error(err)
		} finally {
			setLoading(false)
		}
	}, 500)

	// Refresh Handler
	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		try {
			await handleSearch(searchQuery)
		} finally {
			setRefreshing(false)
		}
	}, [searchQuery])

	// Service Selection Handler
	const toggleService = (service: ServiceType) => {
		setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
	}

	// Render Service Chip
	const renderServiceChip = (serviceKey: ServiceType) => (
		<Chip
			key={serviceKey}
			icon={() => (
				<MaterialCommunityIcons
					name={getServiceIcon(serviceKey) as keyof typeof MaterialCommunityIcons.glyphMap}
					size={16}
					color={selectedServices.includes(serviceKey) ? Colors.white : Colors.blue.DEFAULT}
				/>
			)}
			selected={selectedServices.includes(serviceKey)}
			onPress={() => toggleService(serviceKey)}
			style={[styles.filterChip, selectedServices.includes(serviceKey) && styles.filterChipSelected]}
			textStyle={[styles.filterChipText, selectedServices.includes(serviceKey) && styles.filterChipTextSelected]}
		>
			{ServiceCategory[serviceKey].displayName}
		</Chip>
	)

	// Render Company Card
	const renderCompanyCard = (company: Company) => (
		<Card key={company.id} style={styles.companyCard} onPress={() => onCompanySelect?.(company.id)}>
			<Card.Title
				title={company.name}
				subtitle={company.location}
				left={(props) =>
					company.profileImage ? (
						<Avatar.Image {...props} source={{ uri: company.profileImage }} />
					) : (
						<Avatar.Icon {...props} icon="domain" />
					)
				}
				right={(props) => (
					<View style={styles.ratingContainer}>
						<MaterialCommunityIcons name="star" size={16} color={Colors.blue.DEFAULT} />
						<Text style={styles.ratingText}>{company.rating}</Text>
						<Text style={styles.reviewCount}>({company.reviewCount})</Text>
					</View>
				)}
			/>
			<Card.Content>
				<Text numberOfLines={2} style={styles.description}>
					{company.description}
				</Text>
				<View style={styles.serviceChips}>
					{company.services.map((service) => (
						<Chip
							key={service}
							icon={() => (
								<MaterialCommunityIcons
									name={getServiceIcon(service) as keyof typeof MaterialCommunityIcons.glyphMap}
									size={16}
									color={Colors.blue.dark}
								/>
							)}
							style={styles.serviceChip}
							textStyle={styles.serviceChipText}
						>
							{ServiceCategory[service].displayName}
						</Chip>
					))}
				</View>
			</Card.Content>
		</Card>
	)

	return (
		<ErrorBoundary>
			<View style={[styles.container, { paddingTop: insets.top }]}>
				{/* Header Section */}
				<View style={styles.header}>
					<Text style={styles.title}>Companies</Text>
				</View>

				{/* Search and Filters */}
				<View style={styles.searchSection}>
					<Searchbar
						placeholder="Search companies"
						onChangeText={(text) => {
							setSearchQuery(text)
							handleSearch(text)
						}}
						value={searchQuery}
						style={styles.searchBar}
					/>

					<View style={styles.filterSection}>
						<Text style={styles.filterTitle}>Filter by Services:</Text>
						<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceFiltersScroll}>
							<View style={styles.serviceFilters}>{SERVICES.map((service) => renderServiceChip(service.key))}</View>
						</ScrollView>
					</View>
				</View>

				{/* Results Section */}
				{loading && !refreshing ? (
					<View style={styles.loadingContainer}>
						<RNActivityIndicator size="large" color={Colors.blue.DEFAULT} />
					</View>
				) : companies.length === 0 ? (
					<View style={styles.emptyState}>
						<MaterialCommunityIcons name="database-search" size={48} color={Colors.slate.DEFAULT} />
						<Text style={styles.emptyStateText}>No companies found</Text>
					</View>
				) : (
					<ScrollView
						style={styles.companiesList}
						contentContainerStyle={styles.companiesListContent}
						refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.blue.DEFAULT]} />}
					>
						{companies.map(renderCompanyCard)}
					</ScrollView>
				)}

				{/* Error Modal */}
				{error && (
					<Portal>
						<Modal visible={!!error} onDismiss={() => setError("")} contentContainerStyle={styles.errorModal}>
							<Text style={styles.errorText}>{error}</Text>
							<Button mode="contained" onPress={() => setError("")} style={styles.errorButton}>
								OK
							</Button>
						</Modal>
					</Portal>
				)}
			</View>
		</ErrorBoundary>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	header: {
		padding: 16,
		backgroundColor: Colors.white,
		borderBottomWidth: 1,
		borderBottomColor: Colors.blue.lightest,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: Colors.dark_blue.DEFAULT,
	},
	searchSection: {
		padding: 16,
		backgroundColor: Colors.white,
		borderBottomWidth: 1,
		borderBottomColor: Colors.blue.lightest,
	},
	searchBar: {
		marginBottom: 16,
		backgroundColor: Colors.offwhite,
		elevation: 2,
	},
	filterSection: {
		marginBottom: 8,
	},
	filterTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: Colors.dark_blue.DEFAULT,
		marginBottom: 8,
	},
	serviceFiltersScroll: {
		flexGrow: 0,
	},
	serviceFilters: {
		flexDirection: "row",
		gap: 8,
		paddingRight: 16,
	},
	filterChip: {
		backgroundColor: Colors.white,
		borderColor: Colors.blue.DEFAULT,
		borderWidth: 1,
	},
	filterChipSelected: {
		backgroundColor: Colors.blue.DEFAULT,
	},
	filterChipText: {
		color: Colors.blue.DEFAULT,
	},
	filterChipTextSelected: {
		color: Colors.white,
	},
	companiesList: {
		flex: 1,
		backgroundColor: Colors.offwhite,
	},
	companiesListContent: {
		padding: 16,
		gap: 16,
	},
	companyCard: {
		backgroundColor: Colors.white,
		elevation: 2,
	},
	ratingContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 16,
		gap: 4,
	},
	ratingText: {
		fontSize: 14,
		fontWeight: "600",
		color: Colors.dark_blue.DEFAULT,
	},
	reviewCount: {
		fontSize: 12,
		color: Colors.slate.DEFAULT,
	},
	description: {
		fontSize: 14,
		color: Colors.slate.DEFAULT,
		marginBottom: 12,
	},
	serviceChips: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	serviceChip: {
		backgroundColor: Colors.blue.lightest,
	},
	serviceChipText: {
		fontSize: 12,
		color: Colors.blue.dark,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyState: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
	emptyStateText: {
		fontSize: 16,
		color: Colors.slate.DEFAULT,
		textAlign: "center",
	},
	errorModal: {
		backgroundColor: Colors.white,
		padding: 20,
		margin: 40,
		borderRadius: 8,
		alignItems: "center",
	},
	errorText: {
		fontSize: 16,
		color: Colors.dark_blue.DEFAULT,
		marginBottom: 16,
		textAlign: "center",
	},
	errorButton: {
		backgroundColor: Colors.blue.DEFAULT,
	},
})

export default CompanyListScreen
