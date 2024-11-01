// service-areas.tsx
import React from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Provider as PaperProvider } from "react-native-paper"
import ServiceAreasView from "@/components/service_areas/ServiceAreasView"

export default function ServiceAreasScreen() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<PaperProvider>
				<ServiceAreasView />
			</PaperProvider>
		</GestureHandlerRootView>
	)
}
