// src/app/(protected)/(tabs)/_layout.tsx
import React from "react"
import { Tabs } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false, // This removes the header for all tab screens
				tabBarActiveTintColor: Colors.blue.DEFAULT,
				tabBarInactiveTintColor: Colors.slate.DEFAULT,
			}}
		>
			<Tabs.Screen
				name="search"
				options={{
					title: "Search",
					headerShown: false, // Redundant but explicit
					tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="magnify" size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="companies"
				options={{
					title: "Companies",
					headerShown: false, // Redundant but explicit
					tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="office-building" size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="service-areas"
				options={{
					title: "Areas",
					headerShown: false, // Redundant but explicit
					tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="map-marker" size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerShown: false, // Redundant but explicit
					tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" size={size} color={color} />,
				}}
			/>
		</Tabs>
	)
}
