import { useEffect } from "react"
import { useRouter } from "expo-router"
import { supabase } from "@/supabase"
import { Href } from "expo-router"

/**
 * Custom React hook that enforces authentication requirements for protected routes.
 * Automatically redirects unauthenticated users to a specified path.
 *
 * @param {string} redirectPath - The path to redirect unauthenticated users to
 * @default "/"
 */
export const useRequiredAuth = (redirectPath: string = "/") => {
	const router = useRouter()

	useEffect(() => {
		let isSubscribed = true

		/**
		 * Verifies the user's authentication status by checking their session.
		 * Redirects to the specified path if no valid session is found.
		 *
		 * @returns {Promise<void>}
		 * @throws Logs any authentication or session check errors to console
		 */
		const checkAuth = async () => {
			try {
				const { data, error } = await supabase.auth.getSession()

				if (error) {
					console.error("Auth check error:", error)
					if (isSubscribed) router.replace(redirectPath as Href)
					return
				}

				if (!data.session && isSubscribed) {
					router.replace(redirectPath as Href)
				}
			} catch (error) {
				console.error("Session check failed:", error)
				if (isSubscribed) router.replace(redirectPath as Href)
			}
		}

		// Initial authentication check
		checkAuth()

		/**
		 * Sets up a listener for authentication state changes.
		 * Redirects to the specified path if the user becomes unauthenticated.
		 */
		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
			if (!session && isSubscribed) {
				router.replace(redirectPath as Href)
			}
		})

		/**
		 * Cleanup function that runs on component unmount:
		 * - Prevents state updates after unmount by setting isSubscribed to false
		 * - Removes the authentication state change listener
		 *
		 * @returns {void}
		 */
		return () => {
			isSubscribed = false
			authListener.subscription.unsubscribe()
		}
	}, [router, redirectPath])
}
