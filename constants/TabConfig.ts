import { TabConfig } from "@/types/navigation"

export const TAB_CONFIG: Record<string, TabConfig> = {
	search: {
		name: "search",
		title: "Search",
		iconName: "magnify",
	},
	companies: {
		name: "companies",
		title: "Companies",
		iconName: "office-building",
	},
	serviceAreas: {
		name: "service-areas",
		title: "Service Areas",
		iconName: "map-marker-radius",
	},
	profile: {
		name: "profile",
		title: "Profile",
		iconName: "account-circle",
	},
}
