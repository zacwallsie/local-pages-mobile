// src/components/auth/AuthHeader.tsx
import React from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "react-native-paper"
import { Logo } from "./Logo"
import { Colors } from "@/constants/Colors"

interface AuthHeaderProps {
	topPadding: number
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ topPadding }) => (
	<View style={[styles.headerContainer, { paddingTop: topPadding + 48 }]}>
		<View style={styles.contentContainer}>
			<Logo />
			<Text style={styles.appName}>Local Pages</Text>
			<Text style={styles.tagline}>Find trusted local businesses</Text>
		</View>
	</View>
)

const styles = StyleSheet.create({
	headerContainer: {
		width: "100%",
		backgroundColor: "white",
		alignItems: "center",
		paddingBottom: 20,
	},
	contentContainer: {
		alignItems: "center",
		gap: 12,
	},
	appName: {
		fontSize: 32,
		fontWeight: "bold",
		color: Colors.darks.darkest,
		textAlign: "center",
	},
	tagline: {
		fontSize: 16,
		color: Colors.slate.DEFAULT,
		textAlign: "center",
	},
})
