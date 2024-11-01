// src/hooks/useSignUpForm.ts
import { useState } from "react"
import { SignUpFormData, ValidationError } from "@/types/auth"
import { validateSignUpForm } from "@/utils/validation"

interface SignUpFormState {
	formData: SignUpFormData
	loading: boolean
	errors: ValidationError[]
	updateField: (field: keyof SignUpFormData, value: string) => void
	isValid: boolean
}

export const useSignUpForm = (): SignUpFormState => {
	const [formData, setFormData] = useState<SignUpFormData>({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
	})
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState<ValidationError[]>([])

	const updateField = (field: keyof SignUpFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
		setErrors((prev) => prev.filter((error) => error.field !== field))
	}

	const isValid = validateSignUpForm(formData).length === 0

	return {
		formData,
		loading,
		errors,
		updateField,
		isValid,
	}
}
