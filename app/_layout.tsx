// app/_layout.tsx

import { Slot } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Session } from "@supabase/supabase-js"
import { supabase } from "../supabase"
import { Colors } from "@/constants/Colors"

// Define theme once outside the component
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
			try {
				const { data } = await supabase.auth.getSession()
				setSession(data.session)
			} catch (error) {
				console.error("Error getting session:", error)
			} finally {
				setLoading(false)
			}
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
		return (
			<PaperProvider theme={theme}>
				<SafeAreaProvider>
					<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
						<ActivityIndicator size="large" color={theme.colors.primary} />
					</View>
				</SafeAreaProvider>
			</PaperProvider>
		)
	}

	return (
		<PaperProvider theme={theme}>
			<SafeAreaProvider>
				<Slot />
			</SafeAreaProvider>
		</PaperProvider>
	)
}
