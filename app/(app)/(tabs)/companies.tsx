import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Provider as PaperProvider } from "react-native-paper"
import CompanyListScreen from "@/components/companies/CompaniesList"

export default function Companies() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<CompanyListScreen
				onCompanySelect={(companyId) => {
					// Handle company selection
					console.log("Selected company:", companyId)
					// Navigate to company profile or perform other actions
				}}
			/>
		</GestureHandlerRootView>
	)
}
