// src/components/common/LoadingState.tsx
import React from "react"
import { View, StyleSheet } from "react-native"
import { ActivityIndicator, Text } from "react-native-paper"
import { Colors } from "@/constants/Colors"

interface LoadingStateProps {
	message?: string
}

/**
 * Inputted loading indicator component
 */
export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={Colors.blue.DEFAULT} />
			<Text style={styles.text}>{message}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.offwhite,
	},
	text: {
		marginTop: 16,
		color: Colors.slate.DEFAULT,
	},
})
