// src/components/auth/Logo.tsx
import React from "react"
import { View, Image, StyleSheet } from "react-native"
import { LAYOUT } from "@/constants/Layout"

export const Logo: React.FC = () => (
	<View style={styles.logoContainer}>
		<View style={styles.logoCircle}>
			<Image source={require("@/assets/images/local-pages-logo.png")} style={styles.logoImage} resizeMode="contain" />
		</View>
	</View>
)

const styles = StyleSheet.create({
	logoContainer: {
		alignItems: "center",
		marginBottom: 8,
	},
	logoCircle: {
		width: LAYOUT.CIRCLE_SIZE,
		height: LAYOUT.CIRCLE_SIZE,
		borderRadius: LAYOUT.CIRCLE_SIZE / 2,
		backgroundColor: "#B64B45",
		justifyContent: "center",
		alignItems: "center",
	},
	logoImage: {
		width: LAYOUT.LOGO_SIZE,
		height: LAYOUT.LOGO_SIZE,
	},
})
