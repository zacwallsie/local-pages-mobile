import React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Text, Portal, Modal, List } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

interface ServiceSelectorProps {
	value: string
	onSelect: (service: string) => void
	services: readonly string[]
	visible: boolean
	onDismiss: () => void
	onShow: () => void
}

export const ServiceSelector = ({ value, onSelect, services, visible, onDismiss, onShow }: ServiceSelectorProps) => {
	const getServiceIcon = (service: string) => {
		const icons: Record<string, "pipe" | "lightning-bolt" | "broom" | "tree" | "brush" | "tools"> = {
			Plumbing: "pipe",
			Electrical: "lightning-bolt",
			Cleaning: "broom",
			Gardening: "tree",
			Painting: "brush",
		}
		return icons[service] || "tools"
	}

	return (
		<View style={selectorStyles.selector}>
			<TouchableOpacity onPress={onShow} style={selectorStyles.selectorButton}>
				<View style={selectorStyles.selectorLeft}>
					<MaterialCommunityIcons
						name={value ? getServiceIcon(value) : "tools"}
						size={24}
						color={value ? Colors.blue.DEFAULT : Colors.slate.DEFAULT}
					/>
					<Text style={[selectorStyles.selectorText, !value && selectorStyles.selectorPlaceholder]}>{value || "Select a service"}</Text>
				</View>
				<MaterialCommunityIcons name="chevron-down" size={24} color={Colors.slate.DEFAULT} />
			</TouchableOpacity>

			<Portal>
				<Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={selectorStyles.modalContent}>
					<View style={selectorStyles.modalHeader}>
						<Text style={selectorStyles.modalTitle}>Select Service</Text>
					</View>
					{services.map((service) => (
						<TouchableOpacity
							key={service}
							style={[selectorStyles.serviceItem, service === value && selectorStyles.selectedService]}
							onPress={() => {
								onSelect(service)
								onDismiss()
							}}
						>
							<MaterialCommunityIcons
								name={getServiceIcon(service)}
								size={24}
								color={service === value ? Colors.blue.DEFAULT : Colors.slate.DEFAULT}
							/>
							<Text style={selectorStyles.serviceText}>{service}</Text>
						</TouchableOpacity>
					))}
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
		backgroundColor: Colors.white,
		margin: 20,
		padding: 16,
		borderRadius: 12,
		maxHeight: "80%",
	},
	modalHeader: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.blue.lightest,
		paddingBottom: 16,
		marginBottom: 8,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: Colors.dark_blue.DEFAULT,
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
