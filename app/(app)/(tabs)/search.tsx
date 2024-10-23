import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Provider as PaperProvider } from "react-native-paper"
import SearchScreen from "@/components/search/SearchScreen"

export default function Search() {
	// Main Render
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SearchScreen
				onSearch={async (params) => {
					// Handle saving location/service
					console.log("Search params:", params)
				}}
				onCompanySearch={async (params) => {
					// Handle company search
					console.log("Company search params:", params)
				}}
			/>
		</GestureHandlerRootView>
	)
}
