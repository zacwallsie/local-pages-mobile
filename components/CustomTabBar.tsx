// components/CustomTabBar.tsx

import React from "react"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { BottomNavigation } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
	const routes = state.routes.map((route) => {
		const options = descriptors[route.key].options

		let iconName: string

		if (route.name === "search") {
			iconName = "magnify"
		} else if (route.name === "profile") {
			iconName = "account-circle"
		} else {
			iconName = "circle"
		}

		return {
			key: route.key,
			title: options.title || route.name,
			icon: (props: { color: string; size: number }) => <MaterialCommunityIcons name={iconName as any} color={props.color} size={props.size} />,
		}
	})

	return (
		<BottomNavigation
			navigationState={{ index: state.index, routes }}
			onIndexChange={(index) => {
				navigation.navigate(state.routes[index].name)
			}}
			renderScene={() => null}
			barStyle={{ backgroundColor: Colors.white }}
		/>
	)
}
