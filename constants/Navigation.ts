// src/constants/navigation.ts
export const ROUTES = {
	AUTH: {
		ROOT: "/",
		SIGN_UP: "/sign-up",
		MOBILE_SIGN_UP: "/mobile-sign-up",
	},
	PROTECTED: {
		TABS: {
			SEARCH: "/search",
			COMPANIES: "/companies",
			SERVICE_AREAS: "/service-areas",
			PROFILE: "/profile",
		},
		COMPANY_DETAILS: (id: string) => `/companies/${id}`,
	},
} as const

export const STACK_OPTIONS = {
	DEFAULT: {
		headerShown: false,
	},
} as const
