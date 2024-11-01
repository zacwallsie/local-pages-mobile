import { supabase } from "@/supabase"
import { Company, SearchParams } from "@/types/supabase"
import { PostgrestError } from "@supabase/supabase-js"

interface SearchResult {
	companies: Company[]
	error: PostgrestError | null
}

export const searchServiceAreas = async (params: SearchParams): Promise<SearchResult> => {
	const { location, service, radius = 10 } = params

	try {
		const { data: companies, error } = await supabase.rpc("search_companies_in_radius", {
			lat: location.latitude,
			lng: location.longitude,
			radius_km: radius,
			service_category: service,
		})

		if (error) {
			console.error("Error searching companies:", error)
			return { companies: [], error }
		}

		console.log(`Found ${companies?.length || 0} companies`)
		return { companies: companies || [], error: null }
	} catch (err) {
		console.error("Error in searchServiceAreas:", err)
		return {
			companies: [],
			error: {
				name: "SearchServiceError",
				message: "Failed to search service areas",
				details: "",
				hint: "",
				code: "SEARCH_ERROR",
			},
		}
	}
}
