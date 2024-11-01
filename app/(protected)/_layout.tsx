// src/app/(protected)/_layout.tsx
import React from "react"
import { Stack } from "expo-router"
import { useRequiredAuth } from "@/hooks/useRequiredAuth"
import { ROUTES } from "@/constants/Navigation"

export default function ProtectedLayout() {
	useRequiredAuth(ROUTES.AUTH.ROOT)

	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="companies/[id]"
				options={{
					title: "Company Details",
					presentation: "modal",
				}}
			/>
		</Stack>
	)
}
