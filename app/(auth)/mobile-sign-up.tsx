// src/screens/MobileSignUpScreen.tsx
import React from "react"
import { View, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Button, Text, HelperText, Card } from "react-native-paper"
import { Colors } from "@/constants/Colors"
import { LoadingCard } from "@/components/common/LoadingCard"
import { useAuthUser } from "@/hooks/useAuthUser"
import { userService } from "@/services/user"
import { FormInput } from "@/components/auth/FormInput"

/**
 * Screen component for completing mobile user profile after authentication
 */
export default function MobileSignUpScreen() {
	const router = useRouter()
	const { user, loading: authLoading, error: authError } = useAuthUser()
	const [profile, setProfile] = React.useState({
		firstName: "",
		lastName: "",
	})
	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState("")

	const updateProfile = (field: keyof typeof profile, value: string) => {
		setProfile((prev) => ({ ...prev, [field]: value }))
		setError("")
	}

	const handleMobileSignUp = async () => {
		if (!user) {
			setError("No authenticated user found")
			return
		}

		if (!profile.firstName || !profile.lastName) {
			setError("Please fill in all fields")
			return
		}

		try {
			setLoading(true)

			const response = await userService.createMobileUser(user.id, user.email, profile)

			if (response.success) {
				router.replace("/search")
			} else {
				setError(response.error || "Failed to create profile")
			}
		} catch (err) {
			setError("An unexpected error occurred")
		} finally {
			setLoading(false)
		}
	}

	if (loading || !user) {
		return <LoadingCard />
	}

	if (authError) {
		return <LoadingCard message={authError} />
	}

	return (
		<View style={styles.container}>
			<Card style={styles.card}>
				<Card.Content style={styles.cardContent}>
					<Text variant="headlineMedium" style={styles.title}>
						Complete Your Profile
					</Text>

					<View style={styles.nameContainer}>
						<FormInput
							label="First Name"
							value={profile.firstName}
							onChangeText={(value) => updateProfile("firstName", value)}
							style={[styles.input, styles.nameInput]}
						/>
						<View style={styles.inputSpacing} />
						<FormInput
							label="Last Name"
							value={profile.lastName}
							onChangeText={(value) => updateProfile("lastName", value)}
							style={[styles.input, styles.nameInput]}
						/>
					</View>

					{error ? <HelperText type="error">{error}</HelperText> : null}

					<Button
						mode="contained"
						onPress={handleMobileSignUp}
						style={styles.button}
						loading={authLoading}
						disabled={authLoading || !profile.firstName || !profile.lastName}
						contentStyle={styles.buttonContent}
					>
						Complete Registration
					</Button>
				</Card.Content>
			</Card>
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
})
