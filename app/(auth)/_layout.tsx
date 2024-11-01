// src/app/(auth)/_layout.tsx
import React from "react"
import { Stack } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { AuthLayoutProps } from "@/types/auth"

/**
 * Layout component for authentication screens
 * Handles auth state management and provides consistent styling
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
	const insets = useSafeAreaInsets()
	useAuthRedirect()

	return (
		<>
			<AuthHeader topPadding={insets.top} />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: "white" },
					animation: "none",
					presentation: "modal",
				}}
			>
				{children}
			</Stack>
		</>
	)
}
