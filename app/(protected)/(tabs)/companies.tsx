// companies.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler"
import CompanyListScreen from "@/components/companies/CompaniesListScreen"

export default function Companies() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<CompanyListScreen />
		</GestureHandlerRootView>
	)
}
