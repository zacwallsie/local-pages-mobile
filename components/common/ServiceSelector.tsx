import React from "react"
import { View, StyleSheet, TouchableOpacity, ScrollView, ViewStyle, StyleProp } from "react-native"
import { Text, Portal, Modal } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { ServiceCategory } from "@/types/supabase"

// Type Definitions
type ServiceType = keyof typeof ServiceCategory

/**
 * Props interface for the ServiceSelector component
 * @property {ServiceType | ""} value - Currently selected service type
 * @property {(service: ServiceType) => void} onSelect - Callback when a service is selected
 * @property {boolean} visible - Controls modal visibility
 * @property {() => void} onDismiss - Callback when modal is dismissed
 * @property {() => void} onShow - Callback when modal is shown
 * @property {StyleProp<ViewStyle>} style - Optional custom styles for the container
 * @property {StyleProp<ViewStyle>} buttonStyle - Optional custom styles for the selector button
 */
interface ServiceSelectorProps {
	value: ServiceType | ""
	onSelect: (service: ServiceType) => void
	visible: boolean
	onDismiss: () => void
	onShow: () => void
	style?: StyleProp<ViewStyle>
	buttonStyle?: StyleProp<ViewStyle>
}

// Constant mapping of service types to their corresponding icons
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

/**
 * Pure function to get the icon name for a given service type
 * @param {ServiceType | ""} service - The service type
 * @returns {string} The icon name for the service
 */
const getServiceIcon = (service: ServiceType | ""): string => (service ? SERVICE_ICONS[service] : "tools")

/**
 * Pure function to get the display name for a service type
 * @param {ServiceType | ""} service - The service type
 * @returns {string} The formatted display name
 */
const getDisplayName = (service: ServiceType | ""): string => (service ? ServiceCategory[service].displayName : "Select a service")

/**
 * ServiceSelector Component
 * A dropdown-style selector for service categories with a modal interface.
 * Uses functional programming principles and pure functions for data transformations.
 */
export const ServiceSelector: React.FC<ServiceSelectorProps> = ({ value, onSelect, visible, onDismiss, onShow, style, buttonStyle }) => {
	/**
	 * Renders the selector button content
	 */
	const renderSelectorButton = () => (
		<TouchableOpacity onPress={onShow} style={[selectorStyles.selectorButton, buttonStyle]}>
			<View style={selectorStyles.selectorLeft}>
				<MaterialCommunityIcons
					name={getServiceIcon(value) as keyof typeof MaterialCommunityIcons.glyphMap}
					size={24}
					color={value ? Colors.blue.DEFAULT : Colors.slate.DEFAULT}
				/>
				<Text style={[selectorStyles.selectorText, !value && selectorStyles.selectorPlaceholder]}>{getDisplayName(value)}</Text>
			</View>
			<MaterialCommunityIcons name="chevron-down" size={24} color={Colors.slate.DEFAULT} />
		</TouchableOpacity>
	)

	/**
	 * Renders a service item in the modal list
	 */
	const renderServiceItem = ([key, category]: [string, (typeof ServiceCategory)[ServiceType]]) => (
		<TouchableOpacity
			key={key}
			style={[selectorStyles.serviceItem, key === value && selectorStyles.selectedService]}
			onPress={() => {
				onSelect(key as ServiceType)
				onDismiss()
			}}
		>
			<MaterialCommunityIcons
				name={getServiceIcon(key as ServiceType) as keyof typeof MaterialCommunityIcons.glyphMap}
				size={24}
				color={key === value ? Colors.blue.DEFAULT : Colors.slate.DEFAULT}
			/>
			<Text style={selectorStyles.serviceText}>{category.displayName}</Text>
		</TouchableOpacity>
	)

	return (
		<View style={[selectorStyles.selector, style]}>
			{renderSelectorButton()}

			<Portal>
				<Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={selectorStyles.modalContent}>
					<View style={selectorStyles.modalContainer}>
						<View style={selectorStyles.modalHeader}>
							<Text style={selectorStyles.modalTitle}>Select Service</Text>
						</View>

						<ScrollView
							style={selectorStyles.scrollView}
							showsVerticalScrollIndicator={true}
							contentContainerStyle={selectorStyles.scrollViewContent}
						>
							{Object.entries(ServiceCategory).map(renderServiceItem)}
						</ScrollView>
					</View>
				</Modal>
			</Portal>
		</View>
	)
}

// Styles
const selectorStyles = StyleSheet.create({
	selector: {
		backgroundColor: Colors.blue.lightest,
		borderRadius: 8,
		overflow: "hidden",
	},
	selectorButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 12,
	},
	selectorLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	selectorText: {
		fontSize: 16,
		color: Colors.dark_blue.DEFAULT,
	},
	selectorPlaceholder: {
		color: Colors.slate.DEFAULT,
	},
	modalContent: {
		margin: 20,
		backgroundColor: "transparent",
		maxHeight: "80%",
	},
	modalContainer: {
		backgroundColor: Colors.white,
		borderRadius: 12,
		overflow: "hidden",
		maxHeight: "100%",
	},
	modalHeader: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: Colors.blue.lightest,
		backgroundColor: Colors.white,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: Colors.dark_blue.DEFAULT,
	},
	scrollView: {
		maxHeight: 400,
	},
	scrollViewContent: {
		padding: 16,
		paddingTop: 8,
	},
	serviceItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		marginVertical: 4,
		borderRadius: 8,
		gap: 12,
	},
	selectedService: {
		backgroundColor: Colors.blue.lightest,
	},
	serviceText: {
		fontSize: 16,
		color: Colors.dark_blue.DEFAULT,
	},
})
