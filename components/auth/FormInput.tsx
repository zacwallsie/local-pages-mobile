// src/components/auth/FormInput.tsx
import React from "react"
import { TextInput, HelperText } from "react-native-paper"
import { StyleSheet } from "react-native"
import { Colors } from "@/constants/Colors"

interface FormInputProps {
	label: string
	value: string
	onChangeText: (text: string) => void
	error?: string
	secureTextEntry?: boolean
	autoCapitalize?: "none" | "sentences" | "words" | "characters"
	keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
	style?: object
}

export const FormInput: React.FC<FormInputProps> = ({ label, value, onChangeText, error, ...props }) => (
	<>
		<TextInput
			label={label}
			value={value}
			onChangeText={onChangeText}
			mode="outlined"
			style={[styles.input, props.style]}
			error={!!error}
			{...props}
		/>
		{error && <HelperText type="error">{error}</HelperText>}
	</>
)

const styles = StyleSheet.create({
	input: {
		marginBottom: 8,
		backgroundColor: Colors.white,
	},
})
