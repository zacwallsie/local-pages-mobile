// src/hooks/useAuthRedirect.ts
import { useEffect } from "react"
import { useRouter } from "expo-router"
import { Session } from "@supabase/supabase-js"
import { supabase } from "@/supabase"
import { userService } from "@/services/user"

/**
 * Custom hook to handle authentication state and routing
 */
export const useAuthRedirect = () => {
	const router = useRouter()

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

		const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (session) {
				await handleAuthStateChange(session)
			}
		})

		return () => {
			authListener.subscription.unsubscribe()
		}
	}, [])
}
