// app/(app)/(tabs)/_layout.tsx

import React from "react"
import { Tabs } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useTheme } from "react-native-paper"

export default function TabsLayout() {
	const theme = useTheme()

	return (
		<Tabs
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarActiveTintColor: theme.colors.primary,
				tabBarInactiveTintColor: theme.colors.onSurfaceDisabled,
				tabBarStyle: {
					backgroundColor: theme.colors.surface,
				},
				tabBarIcon: ({ color, size }) => {
					let iconName

					if (route.name === "search") {
						iconName = "magnify"
					} else if (route.name === "profile") {
						iconName = "account-circle"
					} else {
						iconName = "circle"
					}

					return <MaterialCommunityIcons name={iconName as keyof typeof MaterialCommunityIcons.glyphMap} color={color} size={size} />
				},
			})}
		>
			<Tabs.Screen name="search" options={{ title: "Search" }} />
			<Tabs.Screen name="profile" options={{ title: "Profile" }} />
			{/* Add more tabs/screens as needed */}
		</Tabs>
	)
}
