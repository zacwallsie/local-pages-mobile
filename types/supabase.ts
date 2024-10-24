// types/supabase.ts

import { GeoJSON } from "geojson"
import { Home, Briefcase, Heart, Car, Scissors, PawPrint, GraduationCap, Laptop, PartyPopper, SprayCan, Truck, Dumbbell } from "lucide-react-native"

/**
 * Represents a company within the application.
 *
 * @interface Company
 * @property {string} id - The unique identifier for the company.
 * @property {string} user_id - The ID of the user associated with the company.
 * @property {string} company_name - The name of the company.
 * @property {string} [description] - A brief description of the company.
 * @property {string} email - The contact email of the company.
 * @property {string | null} [website_url] - The company's website URL.
 * @property {string | null} [phone_number] - The company's contact phone number.
 * @property {string | null} [logo] - The URL to the company's logo.
 * @property {string | null} [address] - The physical address of the company.
 */
export interface Company {
	id: string
	user_id: string
	company_name: string
	description?: string
	email: string
	website_url?: string | null
	phone_number?: string | null
	logo?: string | null
	address?: string | null
}

/**
 * Represents a user within the application.
 *
 * @interface User
 * @property {string} id - The unique identifier for the user.
 * @property {string} email - The email address of the user.
 */
export interface User {
	id: string
	email: string
}

/**
 * Represents a service offered by a company.
 *
 * @interface Service
 * @property {string} id - The unique identifier for the service.
 * @property {string} company_id - The ID of the company offering the service.
 * @property {string} name - The name of the service.
 * @property {string} description - A detailed description of the service.
 * @property {string} category - The category under which the service falls.
 * @property {string} email - The contact email for the service.
 */
export interface Service {
	id: string
	company_id: string
	name: string
	description: string
	category: string
	email: string
}

/**
 * Represents a geographical service area associated with a service.
 *
 * @interface ServiceArea
 * @property {string} id - The unique identifier for the service area.
 * @property {GeoJSON} geojson - The GeoJSON data defining the service area's boundaries.
 * @property {boolean} is_active - Indicates whether the service area is active.
 * @property {string} service_id - The ID of the service associated with the area.
 * @property {string} company_id - The ID of the company associated with the area.
 * @property {string} email - The contact email for the service area.
 */
export interface ServiceArea {
	id: string
	geojson: GeoJSON
	is_active: boolean
	service_id: string
	company_id: string
	email: string
}

/**
 * Represents the structure of the Supabase database.
 *
 * @interface Database
 * @property {Object} public - The public schema of the database.
 * @property {Object} public.Tables - The tables within the public schema.
 * @property {Object} public.Tables.companies - The companies table.
 * @property {Company} public.Tables.companies.Row - The structure of a row in the companies table.
 * @property {Partial<Company>} public.Tables.companies.Insert - The structure for inserting into the companies table.
 * @property {Partial<Company>} public.Tables.companies.Update - The structure for updating the companies table.
 * @property {Object} public.Tables.services - The services table.
 * @property {Service} public.Tables.services.Row - The structure of a row in the services table.
 * @property {Partial<Service>} public.Tables.services.Insert - The structure for inserting into the services table.
 * @property {Partial<Service>} public.Tables.services.Update - The structure for updating the services table.
 * @property {Object} public.Tables.service_areas - The service_areas table.
 * @property {ServiceArea} public.Tables.service_areas.Row - The structure of a row in the service_areas table.
 * @property {Partial<ServiceArea>} public.Tables.service_areas.Insert - The structure for inserting into the service_areas table.
 * @property {Partial<ServiceArea>} public.Tables.service_areas.Update - The structure for updating the service_areas table.
 * @property {Object} public.Tables.users - The users table.
 * @property {User} public.Tables.users.Row - The structure of a row in the users table.
 * @property {Partial<User>} public.Tables.users.Insert - The structure for inserting into the users table.
 * @property {Partial<User>} public.Tables.users.Update - The structure for updating the users table.
 */
export interface Database {
	public: {
		Tables: {
			companies: {
				Row: Company
				Insert: Partial<Company>
				Update: Partial<Company>
			}
			services: {
				Row: Service
				Insert: Partial<Service>
				Update: Partial<Service>
			}
			service_areas: {
				Row: ServiceArea
				Insert: Partial<ServiceArea>
				Update: Partial<ServiceArea>
			}
			users: {
				Row: User
				Insert: Partial<User>
				Update: Partial<User>
			}
		}
	}
}

/**
 * ServiceCategory: An object that defines all available service categories.
 * Each category has a displayName (for UI), an internalName (for database and validation), and a displayIcon (Lucide icon component).
 *
 * @constant
 * @type {Object}
 */
export const ServiceCategory = {
	HOME_SERVICES: {
		displayName: "Home Services",
		internalName: "HOME_SERVICES",
		displayIcon: Home,
	},
	PROFESSIONAL_SERVICES: {
		displayName: "Professional Services",
		internalName: "PROFESSIONAL_SERVICES",
		displayIcon: Briefcase,
	},
	HEALTH_AND_WELLNESS: {
		displayName: "Health and Wellness",
		internalName: "HEALTH_AND_WELLNESS",
		displayIcon: Heart,
	},
	AUTOMOTIVE: {
		displayName: "Automotive",
		internalName: "AUTOMOTIVE",
		displayIcon: Car,
	},
	BEAUTY_AND_PERSONAL_CARE: {
		displayName: "Beauty and Personal Care",
		internalName: "BEAUTY_AND_PERSONAL_CARE",
		displayIcon: Scissors,
	},
	PET_SERVICES: {
		displayName: "Pet Services",
		internalName: "PET_SERVICES",
		displayIcon: PawPrint,
	},
	EDUCATION_AND_TUTORING: {
		displayName: "Education and Tutoring",
		internalName: "EDUCATION_AND_TUTORING",
		displayIcon: GraduationCap,
	},
	TECHNOLOGY_SERVICES: {
		displayName: "Technology Services",
		internalName: "TECHNOLOGY_SERVICES",
		displayIcon: Laptop,
	},
	EVENT_SERVICES: {
		displayName: "Event Services",
		internalName: "EVENT_SERVICES",
		displayIcon: PartyPopper,
	},
	CLEANING_SERVICES: {
		displayName: "Cleaning Services",
		internalName: "CLEANING_SERVICES",
		displayIcon: SprayCan,
	},
	MOVING_AND_STORAGE: {
		displayName: "Moving and Storage",
		internalName: "MOVING_AND_STORAGE",
		displayIcon: Truck,
	},
	FITNESS_AND_RECREATION: {
		displayName: "Fitness and Recreation",
		internalName: "FITNESS_AND_RECREATION",
		displayIcon: Dumbbell,
	},
} as const

/**
 * ServiceCategoryKey: Type representing the keys of the ServiceCategory object.
 *
 * @typedef {keyof typeof ServiceCategory} ServiceCategoryKey
 */
type ServiceCategoryKey = keyof typeof ServiceCategory

/**
 * ServiceCategoryInternalName: Type representing the internal names of ServiceCategory.
 *
 * @typedef {(typeof ServiceCategory)[ServiceCategoryKey]["internalName"]} ServiceCategoryInternalName
 */
export type ServiceCategoryInternalName = (typeof ServiceCategory)[ServiceCategoryKey]["internalName"]
