import { useEffect } from "react"
import { useRouter } from "expo-router"
import { Session } from "@supabase/supabase-js"
import { supabase } from "@/supabase"
import { userService } from "@/services/user"

/**
 * Custom hook that manages authentication-based routing.
 * Redirects authenticated users based on their mobile user profile status.
 * Routes to /search if mobile profile exists, otherwise to /mobile-sign-up.
 */
export const useAuthRedirect = () => {
	const router = useRouter()

	/**
	 * Handles authentication state changes and performs appropriate redirects
	 * @param {Session | null} session - Current authentication session
	 */
	const handleAuthStateChange = async (session: Session | null) => {
		if (!session) return

		try {
			const hasMobileUser = await userService.checkMobileUserExists(session.user.id)
			router.replace(hasMobileUser ? "/search" : "/mobile-sign-up")
		} catch (error) {
			console.error("Error checking mobile user:", error)
		}
	}

	useEffect(() => {
		/**
		 * Initializes authentication state and performs initial routing
		 */
		const initializeAuth = async () => {
			try {
				const { data } = await supabase.auth.getSession()
				if (data.session) {
					await handleAuthStateChange(data.session)
				}
			} catch (error) {
				console.error("Error initializing auth:", error)
			}
		}

		initializeAuth()

		// Set up authentication state change listener
		const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (session) {
				await handleAuthStateChange(session)
			}
		})

		// Cleanup subscription on unmount
		return () => {
			authListener.subscription.unsubscribe()
		}
	}, [])
}
