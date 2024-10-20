// app/+not-found.tsx

import React from "react"
import { Link } from "expo-router"
import { StyleSheet, View } from "react-native"
import { Text, Button } from "react-native-paper"
import { useTheme } from "react-native-paper"

export default function NotFoundScreen() {
	const theme = useTheme()

	return (
		<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
			<Text variant="headlineLarge" style={{ color: theme.colors.onBackground }}>
				Oops!
			</Text>
			<Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
				This screen doesn't exist.
			</Text>
			<Link href="/search" style={{ marginTop: 24 }}>
				<Button mode="contained" contentStyle={{ paddingVertical: 8 }}>
					Go to Home Screen
				</Button>
			</Link>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
})
