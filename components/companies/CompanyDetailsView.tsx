import React from "react"
import { View, ScrollView, StyleSheet, Image, Linking, SafeAreaView, StatusBar } from "react-native"
import { Text, IconButton, Button, Card, Divider } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { Company } from "@/types/supabase"
import { router } from "expo-router"

interface CompanyDetailsViewProps {
	company: Company
}

export const CompanyDetailsView = ({ company }: CompanyDetailsViewProps) => {
	const contactActions = [
		{
			icon: "phone",
			label: "Phone",
			value: company.phone_number,
			action: () => Linking.openURL(`tel:${company.phone_number}`),
			buttonLabel: "Call",
		},
		{
			icon: "email",
			label: "Email",
			value: company.email,
			action: () => Linking.openURL(`mailto:${company.email}`),
			buttonLabel: "Email",
		},
		{
			icon: "web",
			label: "Website",
			value: company.website_url,
			action: () => company.website_url && Linking.openURL(company.website_url),
			buttonLabel: "Visit",
		},
	].filter((item) => item.value)

	return (
		<View style={styles.safeTop}>
			<SafeAreaView style={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<IconButton icon="arrow-left" size={24} onPress={() => router.back()} iconColor={Colors.blue.DEFAULT} />
					<Text variant="titleLarge" style={styles.headerTitle}>
						Company Details
					</Text>
					<View style={{ width: 48 }} />
				</View>

				{/* Content */}
				<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
					{/* Main Company Card */}
					<Card style={styles.mainCard}>
						<View style={styles.companyHeader}>
							<View style={styles.logoContainer}>
								{company.logo ? (
									<Image source={{ uri: company.logo }} style={styles.logo} resizeMode="cover" />
								) : (
									<View style={styles.placeholderLogo}>
										<MaterialCommunityIcons name="domain" size={48} color={Colors.blue.DEFAULT} />
									</View>
								)}
							</View>
							<Text variant="headlineMedium" style={styles.companyName}>
								{company.company_name}
							</Text>
						</View>

						{/* Description Section */}
						{company.description && (
							<>
								<Divider style={styles.mainDivider} />
								<View style={styles.descriptionContainer}>
									<Text variant="titleMedium" style={styles.sectionTitle}>
										About
									</Text>
									<Text variant="bodyLarge" style={styles.description}>
										{company.description}
									</Text>
								</View>
							</>
						)}
					</Card>

					{/* Contact Information Card */}
					<Card style={styles.contentCard}>
						<Card.Content>
							<Text variant="titleMedium" style={styles.sectionTitle}>
								Contact Information
							</Text>
							<View style={styles.contactList}>
								{contactActions.map((item, index) => (
									<React.Fragment key={item.icon}>
										<View style={styles.contactItem}>
											<View style={styles.contactInfo}>
												<MaterialCommunityIcons
													name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
													size={20}
													color={Colors.blue.DEFAULT}
													style={styles.contactIcon}
												/>
												<View style={styles.contactText}>
													<Text variant="bodyMedium" style={styles.contactLabel}>
														{item.label}
													</Text>
													<Text variant="bodyMedium" style={styles.contactValue} numberOfLines={1}>
														{item.value}
													</Text>
												</View>
											</View>
											<Button
												mode="contained-tonal"
												icon={item.icon}
												onPress={item.action}
												style={styles.actionButton}
												labelStyle={styles.buttonText}
												compact
											>
												{item.buttonLabel}
											</Button>
										</View>
										{index < contactActions.length - 1 && <Divider style={styles.contactDivider} />}
									</React.Fragment>
								))}
							</View>
						</Card.Content>
					</Card>

					{/* Address Card */}
					{company.address && (
						<Card style={styles.contentCard}>
							<Card.Content>
								<View style={styles.addressHeader}>
									<MaterialCommunityIcons name="map-marker" size={24} color={Colors.blue.DEFAULT} />
									<Text variant="titleMedium" style={styles.addressTitle}>
										Address
									</Text>
								</View>
								<Text variant="bodyLarge" style={styles.addressText}>
									{company.address}
								</Text>
							</Card.Content>
						</Card>
					)}
				</ScrollView>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	safeTop: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	container: {
		flex: 1,
		backgroundColor: Colors.offwhite,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 4,
		paddingVertical: 8,
		backgroundColor: Colors.white,
		elevation: 2,
		shadowColor: Colors.slate.DEFAULT,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	headerTitle: {
		flex: 1,
		textAlign: "center",
		color: Colors.dark_blue.DEFAULT,
		fontWeight: "600",
		marginRight: 48,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
		gap: 16,
	},
	mainCard: {
		elevation: 2,
		borderRadius: 12,
		backgroundColor: Colors.white,
	},
	contentCard: {
		elevation: 2,
		borderRadius: 12,
		backgroundColor: Colors.white,
	},
	companyHeader: {
		alignItems: "center",
		padding: 24,
	},
	logoContainer: {
		width: 120,
		height: 120,
		borderRadius: 60,
		marginBottom: 16,
		overflow: "hidden",
		backgroundColor: Colors.blue.lightest,
		justifyContent: "center",
		alignItems: "center",
		elevation: 3,
		shadowColor: Colors.slate.DEFAULT,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	logo: {
		width: "100%",
		height: "100%",
	},
	placeholderLogo: {
		width: "100%",
		height: "100%",
		backgroundColor: Colors.blue.lightest,
		justifyContent: "center",
		alignItems: "center",
	},
	companyName: {
		color: Colors.dark_blue.DEFAULT,
		fontWeight: "bold",
		textAlign: "center",
	},
	mainDivider: {
		marginHorizontal: 16,
	},
	descriptionContainer: {
		padding: 24,
		paddingTop: 16,
	},
	sectionTitle: {
		color: Colors.dark_blue.DEFAULT,
		fontWeight: "600",
		marginBottom: 16,
	},
	description: {
		color: Colors.slate.DEFAULT,
		lineHeight: 24,
	},
	contactList: {
		gap: 12,
	},
	contactItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	contactInfo: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		marginRight: 12,
	},
	contactIcon: {
		marginRight: 12,
	},
	contactText: {
		flex: 1,
	},
	contactLabel: {
		color: Colors.slate.DEFAULT,
		fontSize: 12,
	},
	contactValue: {
		color: Colors.dark_blue.DEFAULT,
	},
	contactDivider: {
		marginVertical: 8,
	},
	actionButton: {
		minWidth: 80,
	},
	buttonText: {
		fontSize: 12,
		fontWeight: "500",
	},
	addressHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 12,
	},
	addressTitle: {
		color: Colors.dark_blue.DEFAULT,
		fontWeight: "600",
	},
	addressText: {
		color: Colors.slate.DEFAULT,
		marginLeft: 32,
	},
})

export default CompanyDetailsView
