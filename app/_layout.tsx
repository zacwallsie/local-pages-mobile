// app/_layout.tsx
import React from "react"
import { Slot } from "expo-router"
import { Provider as PaperProvider } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { theme } from "@/theme/theme"
import { useAuthSession } from "@/hooks/useAuthSession"
import { LoadingScreen } from "@/components/common/LoadingScreen"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"

/**
 * Root layout component that provides theme, authentication, and error handling
 * throughout the application
 */
export default function RootLayout() {
	const { loading, error } = useAuthSession()

	if (error) {
		return (
			<ErrorBoundary>
				<div>Error: {error.message}</div>
			</ErrorBoundary>
		)
	}

	return (
		<PaperProvider theme={theme}>
			<SafeAreaProvider>{loading ? <LoadingScreen /> : <Slot />}</SafeAreaProvider>
		</PaperProvider>
	)
}
