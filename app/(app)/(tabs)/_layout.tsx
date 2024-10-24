// app/(app)/(tabs)/_layout.tsx

import React from "react"
import { Tabs } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useTheme } from "react-native-paper"
import { TAB_CONFIG } from "@/constants/TabConfig"

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
					const iconName = TAB_CONFIG[route.name]?.iconName || "circle"
					return <MaterialCommunityIcons name={iconName} color={color} size={size} />
				},
			})}
		>
			{Object.values(TAB_CONFIG).map((tab) => (
				<Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title }} />
			))}
		</Tabs>
	)
}
