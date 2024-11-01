import React from "react"
import { View, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { TextInput, Button, Text, HelperText, Card } from "react-native-paper"
import { Colors } from "@/constants/Colors"
import { useSignInForm } from "@/hooks/useSignInForm"

/**
 * Screen component for user sign in
 */
export default function SignInScreen() {
	const router = useRouter()
	const { credentials, loading, error, updateField, handleSignIn } = useSignInForm()

	return (
		<View style={styles.container}>
			<Card style={styles.card}>
				<Card.Content style={styles.cardContent}>
					<Text variant="headlineMedium" style={styles.title}>
						Welcome Back
					</Text>

					<TextInput
						label="Email"
						value={credentials.email}
						onChangeText={(value) => updateField("email", value)}
						autoCapitalize="none"
						keyboardType="email-address"
						style={styles.input}
						mode="outlined"
						error={!!error}
					/>

					<TextInput
						label="Password"
						value={credentials.password}
						onChangeText={(value) => updateField("password", value)}
						secureTextEntry
						style={styles.input}
						mode="outlined"
						error={!!error}
					/>

					{error ? <HelperText type="error">{error}</HelperText> : null}

					<Button
						mode="contained"
						onPress={handleSignIn}
						style={styles.button}
						loading={loading}
						disabled={loading || !credentials.email || !credentials.password}
						contentStyle={styles.buttonContent}
					>
						Sign In
					</Button>
				</Card.Content>
			</Card>

			<Button mode="text" style={styles.link} onPress={() => router.replace("/sign-up")}>
				<Text variant="bodyLarge" style={styles.linkText}>
					Don't have an account? Sign Up
				</Text>
			</Button>
		</View>
	)
}

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
		marginBottom: 24,
		color: Colors.dark_blue.DEFAULT,
		fontWeight: "bold",
	},
	input: {
		marginBottom: 16,
		backgroundColor: Colors.white,
	},
	button: {
		marginTop: 8,
		backgroundColor: Colors.blue.DEFAULT,
	},
	buttonContent: {
		paddingVertical: 8,
	},
	link: {
		marginTop: 24,
	},
	linkText: {
		color: Colors.blue.DEFAULT,
	},
})
