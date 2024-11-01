import { supabase } from "@/supabase"
import { router } from "expo-router"
import { PostgrestError } from "@supabase/supabase-js"
import { Company, Service, ServiceCategoryKey } from "@/types/supabase"

export interface CompanyWithServices extends Company {
	services: Service[]
}

export async function searchCompanies(
	searchQuery: string = "",
	selectedServices: ServiceCategoryKey[] = []
): Promise<{ companies: CompanyWithServices[]; error: PostgrestError | null }> {
	try {
		let query = supabase.from("companies").select(`
        *,
        services (
          id,
          name,
          description,
          category,
          email
        )
      `)

		// Add company name search if provided
		if (searchQuery.trim()) {
			query = query.ilike("company_name", `%${searchQuery}%`)
		}

		// Fetch the companies
		const { data, error } = await query.limit(30)

		if (error) {
			console.error("Error searching companies:", error)
			return { companies: [], error }
		}

		let companies = data as CompanyWithServices[]

		// Filter companies that have all selected services
		if (selectedServices.length > 0) {
			companies = companies.filter((company) => {
				const companyServiceCategories = company.services.map((service) => service.category)
				return selectedServices.every((category) => companyServiceCategories.includes(category))
			})
		}

		return { companies, error: null }
	} catch (err) {
		console.error("Error in searchCompanies:", err)
		return {
			companies: [],
			error: {
				message: "Failed to search companies",
				details: "",
				hint: "",
				code: "SEARCH_ERROR",
				name: "SearchError",
			},
		}
	}
}
