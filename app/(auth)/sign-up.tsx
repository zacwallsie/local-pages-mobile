// app/auth/sign-up.tsx

import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { supabase } from "../../supabase"
import { Link, useRouter } from "expo-router"
import { TextInput, Button, Text, HelperText, Card } from "react-native-paper"
import { Colors } from "@/constants/Colors"

export default function SignUpScreen() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const router = useRouter()

	const handleSignUp = async () => {
		setLoading(true)
		setError("")
		const { error } = await supabase.auth.signUp({ email, password })
		if (error) {
			setError(error.message)
		} else {
			alert("Check your email for the confirmation link!")
			router.replace("/")
		}
		setLoading(false)
	}

	return (
		<View style={styles.container}>
			<Card style={styles.card}>
				<Card.Content style={styles.cardContent}>
					<Text variant="headlineMedium" style={styles.title}>
						Create Account
					</Text>
					<TextInput
						label="Email"
						value={email}
						onChangeText={setEmail}
						autoCapitalize="none"
						keyboardType="email-address"
						style={styles.input}
						mode="outlined"
					/>
					<TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} mode="outlined" />
					{error ? <HelperText type="error">{error}</HelperText> : null}
					<Button
						mode="contained"
						onPress={handleSignUp}
						style={styles.button}
						loading={loading}
						disabled={loading}
						contentStyle={styles.buttonContent}
					>
						Sign Up
					</Button>
				</Card.Content>
			</Card>

			<Button mode="text" style={styles.link} onPress={() => router.replace("/")}>
				<Text variant="bodyLarge" style={styles.linkText}>
					Already have an account? Sign In
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
