import React from "react"
import { StatusBar } from "react-native"
import { Colors } from "@/constants/Colors"
import { Company } from "@/types/supabase"
import { useLocalSearchParams } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import CompanyDetailsView from "@/components/companies/CompanyDetailsView" // Update path as needed

export default function CompanyDetailsPage() {
	const params = useLocalSearchParams()
	const company: Company = JSON.parse(params.company as string)

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
			<CompanyDetailsView company={company} />
		</GestureHandlerRootView>
	)
}
