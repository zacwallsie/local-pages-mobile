// app/(auth)/_layout.tsx

import { Stack, useRouter } from "expo-router"
import { useEffect } from "react"
import { View, StyleSheet, Image } from "react-native"
import { Text } from "react-native-paper"
import { supabase } from "../../supabase"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import React from "react"

const LOGO_SIZE = 80
const CIRCLE_SIZE = LOGO_SIZE * 1.5

export default function AuthLayout() {
	const router = useRouter()
	const insets = useSafeAreaInsets()

	useEffect(() => {
		const checkSession = async () => {
			const { data } = await supabase.auth.getSession()
			if (data.session) {
				router.replace("/search")
			}
		}

		checkSession()

		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			if (session) {
				router.replace("/search")
			}
		})

		return () => {
			authListener.subscription.unsubscribe()
		}
	}, [])

	return (
		<>
			<View style={[styles.headerContainer, { paddingTop: insets.top + 48 }]}>
				<View style={styles.contentContainer}>
					<View style={styles.logoContainer}>
						<View style={styles.logoCircle}>
							<Image source={require("../../assets/images/local-pages-logo.png")} style={styles.logoImage} resizeMode="contain" />
						</View>
					</View>
					<Text style={styles.appName}>Local Pages</Text>
					<Text style={styles.tagline}>Find trusted local businesses</Text>
				</View>
			</View>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: "white" },
					animation: "none",
					presentation: "modal",
				}}
			/>
		</>
	)
}

const styles = StyleSheet.create({
	headerContainer: {
		width: "100%",
		backgroundColor: "white",
		alignItems: "center",
		paddingBottom: 40,
	},
	contentContainer: {
		alignItems: "center",
		gap: 12,
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 8,
	},
	logoCircle: {
		width: CIRCLE_SIZE,
		height: CIRCLE_SIZE,
		borderRadius: CIRCLE_SIZE / 2,
		backgroundColor: "#B64B45",
		justifyContent: "center",
		alignItems: "center",
	},
	logoImage: {
		width: LOGO_SIZE,
		height: LOGO_SIZE,
	},
	appName: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#2D3748",
		textAlign: "center",
	},
	tagline: {
		fontSize: 16,
		color: "#718096",
		textAlign: "center",
	},
})
