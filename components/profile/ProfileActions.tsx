// src/components/profile/ProfileActions.tsx
import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { Button } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

interface ProfileActionsProps {
	onEdit: () => void
	onSignOut: () => void
	onDeleteRequest: () => void
}

export function ProfileActions({ onEdit, onSignOut, onDeleteRequest }: ProfileActionsProps) {
	return (
		<>
			<View style={styles.mainButtonContainer}>
				<Button
					mode="contained"
					onPress={onEdit}
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
					onPress={onSignOut}
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
				<View style={styles.divider} />
				<Text style={styles.dangerZoneText}>Danger Zone</Text>
				<Button
					mode="contained"
					onPress={onDeleteRequest}
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
