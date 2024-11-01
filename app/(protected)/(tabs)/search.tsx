// search.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Provider as PaperProvider } from "react-native-paper"
import SearchScreen from "@/components/search/SearchScreen"
import { searchServiceAreas } from "@/utils/searchServiceAreas"

export default function Search() {
	// Main Render
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SearchScreen
				onSearch={async (params) => {
					console.log("Search params:", params)
				}}
				onCompanySearch={async ({ location, service, radius }) => {
					console.log("Company search params:", { location, service, radius })

					try {
						const { companies, error } = await searchServiceAreas({
							location,
							service,
							radius,
						})

						if (error) {
							throw error
						}

						return companies
					} catch (error) {
						console.error("Error searching companies:", error)
						throw error
					}
				}}
			/>
		</GestureHandlerRootView>
	)
}
