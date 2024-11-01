// src/components/profile/ProfileEditForm.tsx
import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { TextInput, Button, HelperText } from "react-native-paper"
import { Colors } from "@/constants/Colors"

export interface ProfileFormData {
	firstName: string
	lastName: string
}

export interface ProfileEditFormProps {
	formData: ProfileFormData
	loading: boolean
	error: string
	onSubmit: (data: ProfileFormData) => Promise<void>
	onCancel: () => void
}

export function ProfileEditForm({ formData, loading, error, onSubmit, onCancel }: ProfileEditFormProps) {
	const [localFormData, setLocalFormData] = useState<ProfileFormData>(formData)

	return (
		<View style={styles.container}>
			<TextInput
				label="First Name"
				value={localFormData.firstName}
				onChangeText={(text) => setLocalFormData((prev) => ({ ...prev, firstName: text }))}
				style={styles.input}
				mode="outlined"
				outlineColor={Colors.blue.light}
				activeOutlineColor={Colors.blue.DEFAULT}
			/>
			<TextInput
				label="Last Name"
				value={localFormData.lastName}
				onChangeText={(text) => setLocalFormData((prev) => ({ ...prev, lastName: text }))}
				style={styles.input}
				mode="outlined"
				outlineColor={Colors.blue.light}
				activeOutlineColor={Colors.blue.DEFAULT}
			/>
			{error && (
				<HelperText type="error" style={styles.error}>
					{error}
				</HelperText>
			)}
			<View style={styles.buttonRow}>
				<Button mode="outlined" onPress={onCancel} style={styles.cancelButton} textColor={Colors.blue.DEFAULT}>
					Cancel
				</Button>
				<Button
					mode="contained"
					onPress={() => onSubmit(localFormData)}
					loading={loading}
					disabled={loading}
					buttonColor={Colors.blue.DEFAULT}
				>
					Save Changes
				</Button>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		paddingHorizontal: 20,
		marginTop: 16,
	},
	input: {
		marginBottom: 16,
		backgroundColor: Colors.white,
	},
	error: {
		color: Colors.red.DEFAULT,
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 8,
	},
	cancelButton: {
		marginRight: 12,
		borderColor: Colors.blue.DEFAULT,
	},
})
