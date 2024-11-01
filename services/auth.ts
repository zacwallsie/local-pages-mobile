// src/services/auth.ts
import { supabase } from "@/supabase"
import { SignUpFormData, SignInCredentials } from "@/types/auth"

interface SignUpResponse {
	success: boolean
	error?: string
}

interface AuthResponse {
	success: boolean
	userId?: string
	error?: string
}

export const authService = {
	async signUp(formData: SignUpFormData): Promise<SignUpResponse> {
		try {
			const { data: authData, error: authError } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
			})

			if (authError) throw authError

			if (!authData.user) {
				throw new Error("No user data returned after signup")
			}

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
	 * Authenticates user with email and password
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
