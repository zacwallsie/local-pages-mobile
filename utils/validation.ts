// src/utils/validation.ts
import { SignUpFormData, ValidationError, SignInCredentials } from "@/types/auth"

export const validateSignUpForm = (data: SignUpFormData): ValidationError[] => {
	const errors: ValidationError[] = []

	if (!data.email) {
		errors.push({ field: "email", message: "Email is required" })
	} else if (!/\S+@\S+\.\S+/.test(data.email)) {
		errors.push({ field: "email", message: "Invalid email format" })
	}

	if (!data.password) {
		errors.push({ field: "password", message: "Password is required" })
	} else if (data.password.length < 6) {
		errors.push({ field: "password", message: "Password must be at least 6 characters" })
	}

	if (!data.firstName) {
		errors.push({ field: "firstName", message: "First name is required" })
	}

	if (!data.lastName) {
		errors.push({ field: "lastName", message: "Last name is required" })
	}

	return errors
}

export const validateSignInForm = (credentials: SignInCredentials): string | null => {
	if (!credentials.email) {
		return "Email is required"
	}

	if (!credentials.password) {
		return "Password is required"
	}

	if (!/\S+@\S+\.\S+/.test(credentials.email)) {
		return "Invalid email format"
	}

	return null
}
