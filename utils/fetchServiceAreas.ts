import { supabase } from "@/supabase"
import { ServiceArea, Company, ServiceCategoryKey } from "@/types/supabase"
import { PostgrestError } from "@supabase/supabase-js"
import { Feature, Polygon, FeatureCollection } from "geojson"

interface ServiceAreaWithCompany extends ServiceArea {
	company: Company
	geojson: FeatureCollection
}

interface FetchParams {
	service: ServiceCategoryKey
}

interface FetchResult {
	serviceAreas: ServiceAreaWithCompany[]
	error: PostgrestError | null
}

// Helper function to convert to FeatureCollection
const toFeatureCollection = (geojson: any): FeatureCollection | null => {
	try {
		let feature: Feature<Polygon>

		// If it's already a Feature
		if (geojson.type === "Feature" && geojson.geometry?.type === "Polygon") {
			feature = geojson as Feature<Polygon>
		}
		// If it's a Polygon
		else if (geojson.type === "Polygon") {
			feature = {
				type: "Feature",
				geometry: geojson,
				properties: {},
			}
		} else {
			return null
		}

		// Convert to FeatureCollection
		return {
			type: "FeatureCollection",
			features: [feature],
		}
	} catch (error) {
		console.warn("Error converting to FeatureCollection:", error)
		return null
	}
}

export const fetchServiceAreas = async (params: FetchParams): Promise<FetchResult> => {
	const { service } = params

	try {
		// First get all service IDs for the selected category
		const servicesResponse = await supabase.from("services").select("id").eq("category", service)

		if (servicesResponse.error) {
			console.error("Error fetching services:", servicesResponse.error)
			return {
				serviceAreas: [],
				error: servicesResponse.error,
			}
		}

		const serviceIds = servicesResponse.data || []

		if (serviceIds.length === 0) {
			console.log("No services found for category:", service)
			return {
				serviceAreas: [],
				error: null,
			}
		}

		// Then fetch service areas with company information
		const areasResponse = await supabase
			.from("service_areas")
			.select(
				`
                id,
                geojson,
                is_active,
                service_id,
                company_id,
                email,
                company:companies (
                    id,
                    user_id,
                    company_name,
                    description,
                    email,
                    website_url,
                    phone_number,
                    logo,
                    address
                )
            `
			)
			.eq("is_active", true)
			.in(
				"service_id",
				serviceIds.map((s) => s.id)
			)

		if (areasResponse.error) {
			console.error("Error fetching service areas:", areasResponse.error)
			return {
				serviceAreas: [],
				error: areasResponse.error,
			}
		}

		if (!areasResponse.data) {
			console.log("No service areas found")
			return {
				serviceAreas: [],
				error: null,
			}
		}

		// Transform the data
		const validAreas = areasResponse.data.reduce((acc: ServiceAreaWithCompany[], area) => {
			try {
				if (!area.geojson || !area.company) {
					console.warn("Missing geojson or company data for area:", area.id)
					return acc
				}

				const featureCollection = toFeatureCollection(area.geojson)
				if (!featureCollection) {
					console.warn("Invalid GeoJSON for area:", area.id)
					return acc
				}

				acc.push({
					...area,
					geojson: featureCollection,
					company: area.company as unknown as Company,
				})
			} catch (e) {
				console.warn("Error processing service area:", area.id, e)
			}
			return acc
		}, [])

		console.log(`Found ${validAreas.length} valid service areas`)
		return { serviceAreas: validAreas, error: null }
	} catch (err) {
		console.error("Error in fetchServiceAreas:", err)
		return {
			serviceAreas: [],
			error: {
				name: "FetchServiceAreasError",
				message: "Failed to fetch service areas",
				details: err instanceof Error ? err.message : "Unknown error",
				hint: "",
				code: "FETCH_ERROR",
			},
		}
	}
}
