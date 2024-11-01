// src/components/common/ErrorState.tsx
import React from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text } from "react-native-paper"
import { Colors } from "@/constants/Colors"

interface ErrorStateProps {
	message: string
	onRetry: () => void
	buttonText?: string
}

export function ErrorState({ message, onRetry, buttonText = "Try Again" }: ErrorStateProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>{message}</Text>
			<Button mode="contained" onPress={onRetry} style={styles.button} buttonColor={Colors.blue.DEFAULT}>
				{buttonText}
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.offwhite,
		padding: 20,
	},
	text: {
		color: Colors.red.DEFAULT,
		textAlign: "center",
		marginBottom: 16,
	},
	button: {
		width: "100%",
	},
})
