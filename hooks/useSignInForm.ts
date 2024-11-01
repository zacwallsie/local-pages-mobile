import { useState } from "react"
import { useRouter } from "expo-router"
import { authService } from "@/services/auth"
import { userService } from "@/services/user"
import { SignInCredentials } from "@/types/auth"

/**
 * Interface defining the state and methods returned by the useSignInForm hook
 * @interface
 */
interface SignInState {
	/** Current sign-in credentials */
	credentials: SignInCredentials
	/** Loading state indicator */
	loading: boolean
	/** Error message if sign-in fails */
	error: string
	/** Function to update individual credential fields */
	updateField: (field: keyof SignInCredentials, value: string) => void
	/** Function to handle the sign-in process */
	handleSignIn: () => Promise<void>
}

/**
 * Custom hook for managing sign-in form state and functionality.
 * Handles form state, validation, submission, and navigation after successful sign-in.
 *
 * @returns {SignInState} Object containing form state and management functions
 */
export const useSignInForm = (): SignInState => {
	const router = useRouter()

	/**
	 * State for storing user credentials
	 * @default { email: "", password: "" }
	 */
	const [credentials, setCredentials] = useState<SignInCredentials>({
		email: "",
		password: "",
	})

	/** Loading state for async operations */
	const [loading, setLoading] = useState(false)

	/** Error state for displaying authentication errors */
	const [error, setError] = useState("")

	/**
	 * Updates a specific field in the credentials state and clears any existing errors
	 *
	 * @param {keyof SignInCredentials} field - The credential field to update (email or password)
	 * @param {string} value - The new value for the field
	 * @returns {void}
	 */
	const updateField = (field: keyof SignInCredentials, value: string) => {
		setCredentials((prev) => ({ ...prev, [field]: value }))
		setError("")
	}

	/**
	 * Handles the sign-in process:
	 * 1. Attempts authentication with provided credentials
	 * 2. Checks if mobile user profile exists
	 * 3. Redirects to appropriate page based on profile existence
	 *
	 * @returns {Promise<void>}
	 * @throws Will set error state if authentication fails or other errors occur
	 */
	const handleSignIn = async () => {
		try {
			setLoading(true)
			setError("")

			const authResponse = await authService.signIn(credentials)

			if (!authResponse.success || !authResponse.userId) {
				throw new Error(authResponse.error || "Authentication failed")
			}

			const hasMobileUser = await userService.checkMobileUserExists(authResponse.userId)

			// Redirect based on whether user has completed mobile sign-up
			router.replace(hasMobileUser ? "/search" : "/mobile-sign-up")
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred during sign in")
		} finally {
			setLoading(false)
		}
	}

	return {
		credentials,
		loading,
		error,
		updateField,
		handleSignIn,
	}
}
