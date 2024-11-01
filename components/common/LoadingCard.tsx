// src/components/common/LoadingCard.tsx
import React from "react"
import { View, StyleSheet } from "react-native"
import { Card, Text } from "react-native-paper"
import { Colors } from "@/constants/Colors"

interface LoadingCardProps {
	message?: string
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ message = "Loading..." }) => (
	<View style={styles.container}>
		<Card style={styles.card}>
			<Card.Content style={styles.cardContent}>
				<Text variant="headlineMedium" style={styles.title}>
					{message}
				</Text>
			</Card.Content>
		</Card>
	</View>
)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	card: {
		backgroundColor: Colors.white,
		elevation: 2,
		borderRadius: 12,
	},
	cardContent: {
		padding: 16,
	},
	title: {
		textAlign: "center",
		color: Colors.dark_blue.DEFAULT,
		fontWeight: "bold",
	},
})
