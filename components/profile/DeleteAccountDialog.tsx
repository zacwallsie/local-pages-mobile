// src/components/profile/DeleteAccountDialog.tsx
import React from "react"
import { StyleSheet } from "react-native"
import { Dialog, Button, Text } from "react-native-paper"
import { Colors } from "@/constants/Colors"

interface DeleteAccountDialogProps {
	visible: boolean
	loading: boolean
	onConfirm: () => Promise<boolean>
	onDismiss: () => void
}

export function DeleteAccountDialog({ visible, loading, onConfirm, onDismiss }: DeleteAccountDialogProps) {
	return (
		<Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
			<Dialog.Title style={styles.title}>Delete Account</Dialog.Title>
			<Dialog.Content>
				<Text style={styles.content}>
					Are you sure you want to delete your account? This will remove your profile but maintain your authentication account.
				</Text>
			</Dialog.Content>
			<Dialog.Actions>
				<Button onPress={onDismiss} textColor={Colors.blue.DEFAULT}>
					Cancel
				</Button>
				<Button onPress={onConfirm} textColor={Colors.red.DEFAULT} loading={loading} disabled={loading}>
					Delete
				</Button>
			</Dialog.Actions>
		</Dialog>
	)
}

const styles = StyleSheet.create({
	dialog: {
		backgroundColor: Colors.white,
	},
	title: {
		color: Colors.dark_blue.DEFAULT,
	},
	content: {
		color: Colors.slate.DEFAULT,
	},
})
