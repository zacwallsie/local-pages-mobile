// src/screens/SignUpScreen.tsx
import React from "react"
import { View, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Button, Text, Card } from "react-native-paper"
import { Colors } from "@/constants/Colors"
import { FormInput } from "@/components/auth/FormInput"
import { useSignUpForm } from "@/hooks/useSignUpForm"
import { authService } from "@/services/auth"

export default function SignUpScreen() {
	const router = useRouter()
	const { formData, loading, errors, updateField, isValid } = useSignUpForm()

	const handleSignUp = async () => {
		try {
			const response = await authService.signUp(formData)

			if (response.success) {
				alert("Check your email for the confirmation link!")
				router.replace("/")
			} else {
				alert(response.error)
			}
		} catch (error) {
			alert("An unexpected error occurred")
		}
	}

	const getFieldError = (field: string) => errors.find((error) => error.field === field)?.message

	return (
		<View style={styles.container}>
			<Card style={styles.card}>
				<Card.Content style={styles.cardContent}>
					<Text variant="headlineMedium" style={styles.title}>
						Create Account
					</Text>

					<View style={styles.nameContainer}>
						<FormInput
							label="First Name"
							value={formData.firstName}
							onChangeText={(value) => updateField("firstName", value)}
							style={[styles.nameInput]}
							error={getFieldError("firstName")}
						/>
						<View style={styles.inputSpacing} />
						<FormInput
							label="Last Name"
							value={formData.lastName}
							onChangeText={(value) => updateField("lastName", value)}
							style={[styles.nameInput]}
							error={getFieldError("lastName")}
						/>
					</View>

					<FormInput
						label="Email"
						value={formData.email}
						onChangeText={(value) => updateField("email", value)}
						autoCapitalize="none"
						keyboardType="email-address"
						error={getFieldError("email")}
					/>

					<FormInput
						label="Password"
						value={formData.password}
						onChangeText={(value) => updateField("password", value)}
						secureTextEntry
						error={getFieldError("password")}
					/>

					<Button
						mode="contained"
						onPress={handleSignUp}
						style={styles.button}
						loading={loading}
						disabled={loading || !isValid}
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
	nameContainer: {
		flexDirection: "row",
		marginBottom: 16,
	},
	nameInput: {
		flex: 1,
		marginBottom: 0,
	},
	inputSpacing: {
		width: 12,
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
