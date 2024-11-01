import { useState, useEffect } from "react"
import { supabase } from "@/supabase"
import { useRouter } from "expo-router"

/**
 * Interface for authenticated user data
 */
interface AuthUser {
	/** Unique identifier for the user */
	id: string
	/** User's email address */
	email: string
}

/**
 * Interface for authentication state
 */
interface AuthState {
	/** Current authenticated user, if any */
	user: AuthUser | null
	/** Loading state indicator */
	loading: boolean
	/** Error message if authentication check fails */
	error: string | null
}

/**
 * Custom hook for managing authentication state and user information.
 * Automatically checks user authentication status and redirects to home if unauthenticated.
 *
 * @returns {AuthState} Current authentication state including user data, loading state, and errors
 */
export const useAuthUser = () => {
	const [state, setState] = useState<AuthState>({
		user: null,
		loading: true,
		error: null,
	})
	const router = useRouter()

	useEffect(() => {
		/**
		 * Verifies current user authentication status and updates state accordingly
		 */
		const checkUser = async () => {
			try {
				const {
					data: { user },
					error,
				} = await supabase.auth.getUser()

				if (error) throw error

				if (!user || !user.email) {
					router.replace("/")
					return
				}

				setState({
					user: {
						id: user.id,
						email: user.email,
					},
					loading: false,
					error: null,
				})
			} catch (err) {
				setState({
					user: null,
					loading: false,
					error: err instanceof Error ? err.message : "Failed to fetch user",
				})
			}
		}

		checkUser()
	}, [router])

	return state
}
