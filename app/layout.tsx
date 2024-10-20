// app/layout.tsx

import { Slot } from "expo-router"
import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { Session } from "@supabase/supabase-js"
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper"
import { Colors } from "@/constants/Colors"

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: Colors.blue.DEFAULT,
		accent: Colors.red.DEFAULT,
		background: Colors.offwhite,
		surface: Colors.white,
		text: Colors.darks.dark,
		placeholder: Colors.slate.light,
	},
}

export default function RootLayout() {
	const [session, setSession] = useState<Session | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getInitialSession = async () => {
			const { data } = await supabase.auth.getSession()
			setSession(data.session)
			setLoading(false)
		}

		getInitialSession()

		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})

		return () => {
			authListener.subscription.unsubscribe()
		}
	}, [])

	if (loading) {
		return null // Or a loading indicator
	}

	return (
		<PaperProvider theme={theme}>
			<Slot />
		</PaperProvider>
	)
}
