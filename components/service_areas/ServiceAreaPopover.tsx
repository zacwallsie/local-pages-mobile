// components/ServiceAreaPopover.tsx
import React from "react"
import { View, Image, StyleSheet } from "react-native"
import { Card, Text, IconButton, Button } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { Colors } from "@/constants/Colors"
import { Company } from "@/types/supabase"

interface ServiceAreaPopoverProps {
	company: Company
	onClose: () => void
}

/**
 * Displays company details in a popover when a service area is selected
 */
export const ServiceAreaPopover: React.FC<ServiceAreaPopoverProps> = ({ company, onClose }) => {
	const handleViewCompany = () => {
		onClose()
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
})
