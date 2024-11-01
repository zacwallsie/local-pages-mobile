import React, { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { supabase } from "../../../supabase"
import { Session } from "@supabase/supabase-js"
import { Text, Button, Avatar, TextInput, Portal, Dialog, HelperText, ActivityIndicator, Divider } from "react-native-paper"
import { Colors } from "@/constants/Colors"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface MobileUser {
	first_name: string
	last_name: string
	email: string
}

export default function ProfileScreen() {
	const [session, setSession] = useState<Session | null>(null)
	const [mobileUser, setMobileUser] = useState<MobileUser | null>(null)
	const [loading, setLoading] = useState(true) // Set initial loading state to true
	const [error, setError] = useState("")
	const [editMode, setEditMode] = useState(false)
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)
	const router = useRouter()
	const insets = useSafeAreaInsets()

	useEffect(() => {
		const getSession = async () => {
			try {
				setLoading(true)
				const { data, error: sessionError } = await supabase.auth.getSession()

				if (sessionError) {
					throw sessionError
				}

				setSession(data.session)

				if (data.session?.user) {
					await fetchMobileUser(data.session.user.id)
				} else {
					console.log("No session or user found")
					router.replace("/") // Redirect to sign in if no session
				}
			} catch (err) {
				console.error("Error fetching session:", err)
				setError(err instanceof Error ? err.message : "Failed to load profile")
			} finally {
				setLoading(false)
			}
		}

		getSession()

		// Subscribe to auth changes
		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
			console.log("Auth state changed:", event)
			setSession(newSession)

			if (newSession?.user) {
				await fetchMobileUser(newSession.user.id)
			} else {
				router.replace("/")
			}
		})

		return () => {
			authListener.subscription.unsubscribe()
		}
	}, [])

	const fetchMobileUser = async (userId: string) => {
		try {
			const { data, error } = await supabase.from("mobile_user").select("*").eq("user_id", userId).single()

			if (error) throw error

			console.log("Mobile user data:", data)
			setMobileUser(data)
			setFirstName(data.first_name)
			setLastName(data.last_name)
		} catch (err) {
			console.error("Error fetching mobile user:", err)
			setError(err instanceof Error ? err.message : "Failed to load user profile")
		}
	}

	const handleUpdateProfile = async () => {
		if (!session?.user) return

		try {
			setLoading(true)
			setError("")

			const { error } = await supabase
				.from("mobile_user")
				.update({
					first_name: firstName,
					last_name: lastName,
				})
				.eq("user_id", session.user.id)

			if (error) throw error

			await fetchMobileUser(session.user.id)
			setEditMode(false)
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred")
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteAccount = async () => {
		if (!session?.user) return

		try {
			setLoading(true)
			setError("")

			const { error: deleteError } = await supabase.from("mobile_user").delete().eq("user_id", session.user.id)

			if (deleteError) throw deleteError

			await handleSignOut()
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred")
			setLoading(false)
		}
	}

	const handleSignOut = async () => {
		const { error } = await supabase.auth.signOut()
		if (error) {
			setError(error.message)
		} else {
			router.replace("/")
		}
	}

	// Show loading state
	if (loading) {
		return (
			<View style={[styles.container, { paddingTop: insets.top + 32 }]}>
				<ActivityIndicator size="large" color={Colors.blue.DEFAULT} />
				<Text style={styles.loadingText}>Loading profile...</Text>
			</View>
		)
	}

	// Show error state
	if (error) {
		return (
			<View style={[styles.container, { paddingTop: insets.top + 32 }]}>
				<Text style={styles.errorText}>{error}</Text>
				<Button mode="contained" onPress={handleSignOut} style={styles.button} buttonColor={Colors.blue.DEFAULT}>
					Sign Out
				</Button>
			</View>
		)
	}

	// Show no session state
	if (!session || !mobileUser) {
		return (
			<View style={[styles.container, { paddingTop: insets.top + 32 }]}>
				<Text style={styles.errorText}>No profile found. Please sign in again.</Text>
				<Button mode="contained" onPress={() => router.replace("/")} style={styles.button} buttonColor={Colors.blue.DEFAULT}>
					Sign In
				</Button>
			</View>
		)
	}

	const userEmail = session.user.email || ""
	const avatarLabel = mobileUser.first_name.charAt(0).toUpperCase() + mobileUser.last_name.charAt(0).toUpperCase()

	return (
		<View style={[styles.container, { paddingTop: insets.top + 32 }]}>
			<Avatar.Text size={80} label={avatarLabel} style={{ backgroundColor: Colors.blue.DEFAULT }} color={Colors.white} />

			{editMode ? (
				<View style={styles.editContainer}>
					<TextInput
						label="First Name"
						value={firstName}
						onChangeText={setFirstName}
						style={styles.input}
						mode="outlined"
						outlineColor={Colors.blue.light}
						activeOutlineColor={Colors.blue.DEFAULT}
					/>
					<TextInput
						label="Last Name"
						value={lastName}
						onChangeText={setLastName}
						style={styles.input}
						mode="outlined"
						outlineColor={Colors.blue.light}
						activeOutlineColor={Colors.blue.DEFAULT}
					/>
					{error ? (
						<HelperText type="error" style={{ color: Colors.red.DEFAULT }}>
							{error}
						</HelperText>
					) : null}
					<View style={styles.buttonRow}>
						<Button
							mode="outlined"
							onPress={() => setEditMode(false)}
							style={styles.buttonSpacing}
							textColor={Colors.blue.DEFAULT}
							buttonColor={Colors.white}
						>
							Cancel
						</Button>
						<Button
							mode="contained"
							onPress={handleUpdateProfile}
							loading={loading}
							disabled={loading}
							buttonColor={Colors.blue.DEFAULT}
							textColor={Colors.white}
						>
							Save Changes
						</Button>
					</View>
				</View>
			) : (
				<>
					<Text variant="headlineSmall" style={[styles.name, { color: Colors.dark_blue.DEFAULT }]}>
						{mobileUser.first_name} {mobileUser.last_name}
					</Text>
					<Text variant="bodyLarge" style={[styles.email, { color: Colors.slate.DEFAULT }]}>
						{userEmail}
					</Text>

					<View style={styles.mainButtonContainer}>
						<Button
							mode="contained"
							onPress={() => setEditMode(true)}
							style={styles.button}
							contentStyle={styles.buttonContent}
							buttonColor={Colors.blue.DEFAULT}
							textColor={Colors.white}
							icon={({ size, color }) => <MaterialCommunityIcons name="account-edit" size={size} color={color} />}
						>
							Edit Profile
						</Button>

						<Button
							mode="contained"
							onPress={handleSignOut}
							style={styles.button}
							contentStyle={styles.buttonContent}
							buttonColor={Colors.slate.DEFAULT}
							textColor={Colors.white}
							icon={({ size, color }) => <MaterialCommunityIcons name="logout" size={size} color={color} />}
						>
							Sign Out
						</Button>
					</View>

					<View style={styles.deleteButtonContainer}>
						<Divider style={styles.divider} />
						<Text style={styles.dangerZoneText}>Danger Zone</Text>
						<Button
							mode="contained"
							onPress={() => setShowDeleteDialog(true)}
							style={styles.deleteButton}
							contentStyle={styles.buttonContent}
							buttonColor={Colors.red.DEFAULT}
							textColor={Colors.white}
							icon={({ size, color }) => <MaterialCommunityIcons name="delete-alert" size={size} color={color} />}
						>
							Delete Account
						</Button>
					</View>
				</>
			)}

			<Portal>
				<Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)} style={{ backgroundColor: Colors.white }}>
					<Dialog.Title style={{ color: Colors.dark_blue.DEFAULT }}>Delete Account</Dialog.Title>
					<Dialog.Content>
						<Text style={{ color: Colors.slate.DEFAULT }}>
							Are you sure you want to delete your account? This will remove your profile but maintain your authentication account.
						</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setShowDeleteDialog(false)} textColor={Colors.blue.DEFAULT}>
							Cancel
						</Button>
						<Button onPress={handleDeleteAccount} textColor={Colors.red.DEFAULT} loading={loading} disabled={loading}>
							Delete
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: Colors.offwhite,
	},
	name: {
		marginTop: 16,
		fontWeight: "600",
	},
	email: {
		marginTop: 8,
	},
	editContainer: {
		width: "100%",
		paddingHorizontal: 20,
		marginTop: 16,
	},
	input: {
		marginBottom: 16,
		backgroundColor: Colors.white,
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 8,
	},
	buttonSpacing: {
		marginRight: 12,
		borderColor: Colors.blue.DEFAULT,
	},
	mainButtonContainer: {
		width: "100%",
		paddingHorizontal: 20,
		marginTop: 32,
		gap: 16,
	},
	deleteButtonContainer: {
		width: "100%",
		paddingHorizontal: 20,
		marginTop: "auto", // This pushes it to the bottom
		marginBottom: 32,
		alignItems: "center",
	},
	button: {
		width: "100%",
	},
	deleteButton: {
		width: "100%",
		marginTop: 12,
	},
	buttonContent: {
		paddingVertical: 10, // Slightly increased for better touch targets
	},
	loadingText: {
		marginTop: 16,
		color: Colors.slate.DEFAULT,
	},
	errorText: {
		marginBottom: 16,
		color: Colors.red.DEFAULT,
		textAlign: "center",
		paddingHorizontal: 20,
	},
	divider: {
		width: "100%",
		height: 1,
		backgroundColor: Colors.slate.light,
		marginBottom: 16,
	},
	dangerZoneText: {
		color: Colors.red.DEFAULT,
		fontWeight: "600",
		marginBottom: 8,
	},
})
