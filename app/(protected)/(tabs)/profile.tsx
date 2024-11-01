// profile.tsx
import React from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Provider as PaperProvider } from "react-native-paper"
import ProfileView from "@/components/profile/ProfileView"

export default function ProfileScreen() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<PaperProvider>
				<ProfileView />
			</PaperProvider>
		</GestureHandlerRootView>
	)
}
