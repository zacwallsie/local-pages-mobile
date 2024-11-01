import React from "react"
import { View, ScrollView, StyleSheet, Image, TouchableOpacity, SafeAreaView } from "react-native"
import { Text, IconButton, Card } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { Company } from "@/types/supabase"
import { router } from "expo-router"

interface CompanyListProps {
	companies: Company[]
	onClose: () => void
}

export const CompanyList = ({ companies, onClose }: CompanyListProps) => {
	const handleCompanyPress = (company: Company) => {
		// First close the modal
		onClose()

		// Then navigate to the company details
		// Add a small delay to ensure smooth transition
		setTimeout(() => {
			router.push({
				pathname: "/companies/[id]",
				params: { id: company.id, company: JSON.stringify(company) },
			})
		}, 100)
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text variant="headlineMedium" style={styles.title}>
						Companies Found ({companies.length})
					</Text>
					<IconButton icon="close" size={24} onPress={onClose} />
				</View>

				<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
					{companies.map((company) => (
						<TouchableOpacity key={company.id} onPress={() => handleCompanyPress(company)}>
							<CompanyCard company={company} />
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</SafeAreaView>
	)
}

// CompanyCard component remains the same
const CompanyCard = ({ company }: { company: Company }) => {
	return (
		<Card style={styles.card}>
			<Card.Content style={styles.cardContent}>
				<View style={styles.logoContainer}>
					{company.logo ? (
						<Image source={{ uri: company.logo }} style={styles.logo} resizeMode="cover" />
					) : (
						<View style={styles.placeholderLogo}>
							<MaterialCommunityIcons name="domain" size={30} color={Colors.blue.DEFAULT} />
						</View>
					)}
				</View>

				<View style={styles.companyInfo}>
					<Text variant="titleMedium" style={styles.companyName}>
						{company.company_name}
					</Text>

					{company.address && (
						<Text variant="bodySmall" style={styles.address}>
							{company.address}
						</Text>
					)}

					{company.phone_number && (
						<Text variant="bodySmall" style={styles.phone}>
							{company.phone_number}
						</Text>
					)}
				</View>
			</Card.Content>
		</Card>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: Colors.blue.lightest,
	},
	title: {
		color: Colors.dark_blue.DEFAULT,
		fontWeight: "bold",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
	},
	card: {
		marginBottom: 12,
		elevation: 2,
	},
	cardContent: {
		flexDirection: "row",
		padding: 12,
	},
	logoContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		overflow: "hidden",
		backgroundColor: Colors.blue.lightest,
	},
	logo: {
		width: "100%",
		height: "100%",
	},
	placeholderLogo: {
		width: "100%",
		height: "100%",
		backgroundColor: Colors.blue.lightest,
	},
	companyInfo: {
		marginLeft: 12,
		flex: 1,
	},
	companyName: {
		color: Colors.dark_blue.DEFAULT,
		fontWeight: "600",
		marginBottom: 4,
	},
	address: {
		color: Colors.slate.DEFAULT,
		fontSize: 14,
		marginBottom: 2,
	},
	phone: {
		color: Colors.slate.DEFAULT,
		fontSize: 14,
	},
})
