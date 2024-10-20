// app/(auth)/_layout.tsx

import { Stack, useRouter } from "expo-router"
import { useEffect } from "react"
import { supabase } from "../../supabase"

export default function AuthLayout() {
	const router = useRouter()

	useEffect(() => {
		const checkSession = async () => {
			const { data } = await supabase.auth.getSession()
			if (data.session) {
				router.replace("/search") // Redirect to main app if session exists
			}
		}

		checkSession()

		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			if (session) {
				router.replace("/search")
			}
		})

		return () => {
			authListener.subscription.unsubscribe()
		}
	}, [])

	return <Stack screenOptions={{ headerShown: false }} />
}
