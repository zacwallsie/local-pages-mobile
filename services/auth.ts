import { supabase } from "@/supabase"
import { SignUpFormData, SignInCredentials } from "@/types/auth"

/**
 * Response interface for sign-up operations
 */
interface SignUpResponse {
	/** Indicates if the sign-up operation was successful */
	success: boolean
	/** Error message if sign-up failed */
	error?: string
}

/**
 * Response interface for authentication operations
 */
interface AuthResponse {
	/** Indicates if the authentication operation was successful */
	success: boolean
	/** User ID of the authenticated user */
	userId?: string
	/** Error message if authentication failed */
	error?: string
}

/**
 * Service for handling authentication operations with Supabase
 */
export const authService = {
	/**
	 * Creates a new user account and corresponding mobile user profile
	 * @param {SignUpFormData} formData - User registration data
	 * @returns {Promise<SignUpResponse>} Result of the sign-up operation
	 */
	async signUp(formData: SignUpFormData): Promise<SignUpResponse> {
		try {
			// Create authentication entry
			const { data: authData, error: authError } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
			})

			if (authError) throw authError

			if (!authData.user) {
				throw new Error("No user data returned after signup")
			}

			// Create mobile user profile
			const { error: profileError } = await supabase.from("mobile_user").insert([
				{
					user_id: authData.user.id,
					first_name: formData.firstName,
					last_name: formData.lastName,
					email: formData.email,
				},
			])

			if (profileError) throw profileError

			return { success: true }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "An error occurred during sign up",
			}
		}
	},

	/**
	 * Authenticates user with email and password credentials
	 * @param {SignInCredentials} credentials - User login credentials
	 * @returns {Promise<AuthResponse>} Result of the sign-in operation
	 */
	async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
		try {
			const { data, error } = await supabase.auth.signInWithPassword(credentials)

			if (error) throw error

			if (!data.user) {
				throw new Error("No user data returned after sign in")
			}

			return {
				success: true,
				userId: data.user.id,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "An error occurred during sign in",
			}
		}
	},
}
