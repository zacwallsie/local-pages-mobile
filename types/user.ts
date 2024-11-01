// src/types/user.ts
export interface MobileUser {
	user_id: string
	first_name: string
	last_name: string
	email: string
}

export interface UserProfile {
	firstName: string
	lastName: string
}

export interface ValidationError {
	field: keyof UserProfile
	message: string
}
