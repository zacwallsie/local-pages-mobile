// types/navigation.ts

import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons"

export type TabConfig = {
	name: string
	title: string
	iconName: keyof typeof MaterialCommunityIcons.glyphMap
}
