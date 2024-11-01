// search.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler"
import SearchScreen from "@/components/search/SearchScreen"

export default function Search() {
	// Main Render
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SearchScreen />
		</GestureHandlerRootView>
	)
}
