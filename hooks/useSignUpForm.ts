import { useState } from "react"
import { SignUpFormData, ValidationError } from "@/types/auth"
import { validateSignUpForm } from "@/utils/validation"

/**
 * Interface defining the state and methods returned by the useSignUpForm hook
 * @interface
 */
interface SignUpFormState {
	/** Current form data containing user sign-up information */
	formData: SignUpFormData
	/** Loading state indicator */
	loading: boolean
	/** Array of validation errors for form fields */
	errors: ValidationError[]
	/** Function to update individual form fields */
	updateField: (field: keyof SignUpFormData, value: string) => void
	/** Indicates whether the form data is currently valid */
	isValid: boolean
}

/**
 * Custom hook for managing sign-up form state and validation.
 * Provides form state management, field updates, and validation handling.
 *
 * @returns {SignUpFormState} Object containing form state, validation status, and management functions
 */
export const useSignUpForm = (): SignUpFormState => {
	/**
	 * State for storing user sign-up form data
	 * @default { email: "", password: "", firstName: "", lastName: "" }
	 */
	const [formData, setFormData] = useState<SignUpFormData>({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
	})

	/** Loading state for async operations */
	const [loading, setLoading] = useState(false)

	/**
	 * State for storing validation errors
	 * Each error contains a field name and error message
	 */
	const [errors, setErrors] = useState<ValidationError[]>([])

	/**
	 * Updates a specific field in the form data and removes any existing
	 * validation errors for that field
	 *
	 * @param {keyof SignUpFormData} field - The form field to update (email, password, firstName, or lastName)
	 * @param {string} value - The new value for the field
	 * @returns {void}
	 */
	const updateField = (field: keyof SignUpFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
		setErrors((prev) => prev.filter((error) => error.field !== field))
	}

	/**
	 * Computed property that checks if the form data is valid
	 * Uses validateSignUpForm utility to perform validation
	 * @returns {boolean} True if form has no validation errors
	 */
	const isValid = validateSignUpForm(formData).length === 0

	return {
		formData,
		loading,
		errors,
		updateField,
		isValid,
	}
}
