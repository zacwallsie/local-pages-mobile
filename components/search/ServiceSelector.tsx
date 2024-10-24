import React from "react"
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Text, Portal, Modal } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { ServiceCategory } from "@/types/supabase"

type ServiceType = keyof typeof ServiceCategory

interface ServiceSelectorProps {
	value: ServiceType | ""
	onSelect: (service: ServiceType) => void
	visible: boolean
	onDismiss: () => void
	onShow: () => void
}

export const ServiceSelector = ({ value, onSelect, visible, onDismiss, onShow }: ServiceSelectorProps) => {
	const getServiceIcon = (service: ServiceType | ""): string => {
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
		return service ? icons[service] : "tools"
	}

	const getDisplayName = (service: ServiceType | "") => {
		if (!service) return "Select a service"
		return ServiceCategory[service].displayName
	}

	return (
		<View style={selectorStyles.selector}>
			<TouchableOpacity onPress={onShow} style={selectorStyles.selectorButton}>
				<View style={selectorStyles.selectorLeft}>
					<MaterialCommunityIcons
						name={value ? (getServiceIcon(value) as keyof typeof MaterialCommunityIcons.glyphMap) : "tools"}
						size={24}
						color={value ? Colors.blue.DEFAULT : Colors.slate.DEFAULT}
					/>
					<Text style={[selectorStyles.selectorText, !value && selectorStyles.selectorPlaceholder]}>{getDisplayName(value)}</Text>
				</View>
				<MaterialCommunityIcons name="chevron-down" size={24} color={Colors.slate.DEFAULT} />
			</TouchableOpacity>

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
							{Object.entries(ServiceCategory).map(([key, category]) => (
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
							))}
						</ScrollView>
					</View>
				</Modal>
			</Portal>
		</View>
	)
}

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
		maxHeight: 400, // Set a maximum height for the scrollable area
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
