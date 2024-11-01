import React, { useEffect, useState, useCallback } from "react"
import {
	View,
	ScrollView,
	StyleSheet,
	RefreshControl,
	ActivityIndicator as RNActivityIndicator,
	SafeAreaView,
	Platform,
	StatusBar,
} from "react-native"
import { Button, Text, Chip, Avatar, Card, Searchbar, Portal, Modal } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Colors } from "@/constants/Colors"
import { ServiceCategory, ServiceCategoryKey, Company } from "@/types/supabase"
import { searchCompanies, CompanyWithServices } from "@/utils/searchCompanies"
import { router } from "expo-router"

// Types and Interfaces
type ServiceType = keyof typeof ServiceCategory

interface CompanyListScreenProps {
	onCompanySelect?: (companyId: string) => void
}

interface CompanyCardProps {
	company: CompanyWithServices
}

interface ServiceFilterProps {
	selectedServices: ServiceCategoryKey[]
	onToggleService: (service: ServiceCategoryKey) => void
}

interface ErrorModalProps {
	error: string
	onDismiss: () => void
}

// Constants
const SERVICES = Object.entries(ServiceCategory).map(([key, value]) => ({
	key: key as ServiceType,
	...value,
}))

const SERVICE_ICONS: Record<ServiceType, string> = {
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

// Pure Functions
/**
 * Returns the icon name for a given service type
 */
const getServiceIcon = (service: ServiceType): string => SERVICE_ICONS[service] || "tools"

/**
 * Navigates to company detail screen
 */
const navigateToCompanyDetail = (company: CompanyWithServices): void => {
	router.push({
		pathname: "/companies/[id]",
		params: {
			id: company.id,
			company: JSON.stringify(company),
		},
	})
}

// Component Functions
/**
 * Renders a company card with company information and services
 */
const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => (
	<Card style={styles.companyCard} onPress={() => navigateToCompanyDetail(company)}>
		<Card.Title
			title={company.company_name}
			subtitle={company.address || "Location not specified"}
			left={(props) => (company.logo ? <Avatar.Image {...props} source={{ uri: company.logo }} /> : <Avatar.Icon {...props} icon="domain" />)}
		/>
		<Card.Content>
			<Text numberOfLines={2} style={styles.description}>
				{company.description || "No description available"}
			</Text>
			<View style={styles.serviceChips}>
				{company.services.map((service) => (
					<Chip
						key={service.id}
						icon={() => (
							<MaterialCommunityIcons
								name={getServiceIcon(service.category as ServiceCategoryKey) as any}
								size={16}
								color={Colors.blue.dark}
							/>
						)}
						style={styles.serviceChip}
						textStyle={styles.serviceChipText}
					>
						{ServiceCategory[service.category as ServiceCategoryKey].displayName}
					</Chip>
				))}
			</View>
		</Card.Content>
	</Card>
)

/**
 * Service filter component for filtering companies by service type
 */
const ServiceFilter: React.FC<ServiceFilterProps> = ({ selectedServices, onToggleService }) => (
	<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceFiltersScroll}>
		<View style={styles.serviceFilters}>
			{Object.entries(ServiceCategory).map(([key, value]) => (
				<Chip
					key={key}
					selected={selectedServices.includes(key as ServiceCategoryKey)}
					onPress={() => onToggleService(key as ServiceCategoryKey)}
					style={[styles.filterChip, selectedServices.includes(key as ServiceCategoryKey) && styles.filterChipSelected]}
					textStyle={[styles.filterChipText, selectedServices.includes(key as ServiceCategoryKey) && styles.filterChipTextSelected]}
				>
					{value.displayName}
				</Chip>
			))}
		</View>
	</ScrollView>
)

/**
 * Error modal component for displaying error messages
 */
const ErrorModal: React.FC<ErrorModalProps> = ({ error, onDismiss }) => (
	<Portal>
		<Modal visible={!!error} onDismiss={onDismiss} contentContainerStyle={styles.errorModal}>
			<Text style={styles.errorText}>{error}</Text>
			<Button mode="contained" onPress={onDismiss} style={styles.errorButton}>
				OK
			</Button>
		</Modal>
	</Portal>
)

/**
 * Main CompanyListScreen component
 * Displays a searchable, filterable list of companies with their services
 */
const CompanyListScreen: React.FC<CompanyListScreenProps> = ({ onCompanySelect }) => {
	// State
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedServices, setSelectedServices] = useState<ServiceCategoryKey[]>([])
	const [loading, setLoading] = useState(false)
	const [refreshing, setRefreshing] = useState(false)
	const [error, setError] = useState("")
	const [companies, setCompanies] = useState<CompanyWithServices[]>([])

	const insets = useSafeAreaInsets()

	// Handlers
	const handleSearch = useCallback(async () => {
		try {
			const { companies: searchResults, error } = await searchCompanies(searchQuery, selectedServices)
			if (error) {
				setError(error.message)
			} else {
				setCompanies(searchResults)
			}
		} catch (err) {
			setError("Failed to search companies")
			console.error(err)
		}
	}, [searchQuery, selectedServices])

	const handleRefresh = useCallback(async () => {
		setRefreshing(true)
		try {
			await handleSearch()
		} finally {
			setRefreshing(false)
		}
	}, [handleSearch])

	const toggleService = useCallback((service: ServiceCategoryKey) => {
		setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
	}, [])

	// Effects
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!refreshing) {
				setLoading(true)
				handleSearch().finally(() => setLoading(false))
			}
		}, 500)

		return () => clearTimeout(timeoutId)
	}, [searchQuery, selectedServices, handleSearch, refreshing])

	useEffect(() => {
		setLoading(true)
		handleSearch().finally(() => setLoading(false))
	}, [])

	// Render Helpers
	const renderContent = () => {
		if (loading && !refreshing) {
			return (
				<View style={styles.loadingContainer}>
					<RNActivityIndicator size="large" color={Colors.blue.DEFAULT} />
				</View>
			)
		}

		if (companies.length === 0) {
			return (
				<View style={styles.emptyState}>
					<MaterialCommunityIcons name="database-search" size={48} color={Colors.slate.DEFAULT} />
					<Text style={styles.emptyStateText}>No companies found</Text>
				</View>
			)
		}

		return (
			<ScrollView
				style={styles.companiesList}
				contentContainerStyle={styles.companiesListContent}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.blue.DEFAULT]} />}
			>
				{companies.map((company) => (
					<CompanyCard key={company.id} company={company} />
				))}
			</ScrollView>
		)
	}

	return (
		<SafeAreaView style={[styles.safeArea, { paddingTop: Math.max(insets.top, 20) }]}>
			<View style={styles.container}>
				<View style={[styles.searchSection, Platform.OS === "android" && { paddingTop: StatusBar.currentHeight || 20 }]}>
					<Text style={styles.title}>Companies</Text>
					<Searchbar placeholder="Search companies" onChangeText={setSearchQuery} value={searchQuery} style={styles.searchBar} />
					<ServiceFilter selectedServices={selectedServices} onToggleService={toggleService} />
				</View>

				{renderContent()}
				{error && <ErrorModal error={error} onDismiss={() => setError("")} />}
			</View>
		</SafeAreaView>
	)
}

// Styles remain the same
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	companyCard: {
		marginBottom: 12,
		backgroundColor: Colors.white,
		elevation: 2,
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
	filterChipText: {
		color: Colors.blue.DEFAULT,
	},
	filterChipTextSelected: {
		color: Colors.white,
	},
	filterChip: {
		backgroundColor: Colors.white,
		borderColor: Colors.blue.DEFAULT,
		borderWidth: 1,
	},
	filterChipSelected: {
		backgroundColor: Colors.blue.DEFAULT,
	},
	companiesList: {
		flex: 1,
		backgroundColor: Colors.offwhite,
	},
	companiesListContent: {
		padding: 16,
	},
	container: {
		flex: 1,
		backgroundColor: Colors.offwhite,
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
		marginTop: 16,
		marginBottom: 16,
		backgroundColor: Colors.blue.lightest,
		elevation: 2,
	},
	serviceFiltersScroll: {
		flexGrow: 0,
	},
	serviceFilters: {
		flexDirection: "row",
		gap: 8,
		paddingRight: 16,
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
