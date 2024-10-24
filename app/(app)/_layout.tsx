// app/(app)/_layout.tsx

import { Stack, useRouter } from "expo-router"
import { useEffect } from "react"
import { supabase } from "../../supabase"

export default function AppLayout() {
	const router = useRouter()

	useEffect(() => {
		const checkSession = async () => {
			const { data } = await supabase.auth.getSession()
			if (!data.session) {
				router.replace("/") // Redirect to auth if no session
			}
		}

		checkSession()

		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			if (!session) {
				router.replace("/")
			}
		})

		return () => {
			authListener.subscription.unsubscribe()
		}
	}, [])

	return <Stack screenOptions={{ headerShown: false }} />
}
