// src/hooks/useRequiredAuth.ts
import { useEffect } from "react"
import { useRouter } from "expo-router"
import { supabase } from "@/supabase"
import { Href } from "expo-router"

/**
 * Custom hook that enforces authentication requirement
 * Redirects to auth screen if user is not authenticated
 * @param redirectPath - Path to redirect unauthenticated users to
 */
export const useRequiredAuth = (redirectPath: string = "/") => {
	const router = useRouter()

	useEffect(() => {
		let isSubscribed = true

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

		// Initial check
		checkAuth()

		// Set up auth state listener
		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
			if (!session && isSubscribed) {
				router.replace(redirectPath as Href)
			}
		})

		// Cleanup function
		return () => {
			isSubscribed = false
			authListener.subscription.unsubscribe()
		}
	}, [router, redirectPath])
}
