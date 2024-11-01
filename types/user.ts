import { Session } from "@supabase/supabase-js"

/**
 * Represents a mobile user within the application.
 *
 * @interface MobileUser
 * @property {string} user_id - The unique identifier for the user.
 * @property {string} first_name - The user's first name.
 * @property {string} last_name - The user's last name.
 * @property {string} email - The user's email address.
 */
export interface MobileUser {
	user_id: string
	first_name: string
	last_name: string
	email: string
}

/**
 * Represents the basic profile information for a user.
 *
 * @interface UserProfile
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 */
export interface UserProfile {
	firstName: string
	lastName: string
}

/**
 * Represents a validation error that occurs during profile data validation.
 *
 * @interface ValidationError
 * @property {keyof UserProfile} field - The field that failed validation (must be a key from UserProfile).
 * @property {string} message - The error message describing the validation failure.
 */
export interface ValidationError {
	field: keyof UserProfile
	message: string
}

/**
 * Represents the current state of a user's profile in the application.
 *
 * @interface ProfileState
 * @property {Session | null} session - The user's current session, if any.
 * @property {MobileUser | null} mobileUser - The mobile user's data, if available.
 * @property {boolean} loading - Indicates whether profile data is currently being loaded.
 * @property {string} error - Any error message related to profile operations.
 */
export interface ProfileState {
	session: Session | null
	mobileUser: MobileUser | null
	loading: boolean
	error: string
}

/**
 * Represents the form data structure used for updating a user's profile.
 *
 * @interface ProfileFormData
 * @property {string} firstName - The user's first name as entered in the form.
 * @property {string} lastName - The user's last name as entered in the form.
 */
export interface ProfileFormData {
	firstName: string
	lastName: string
}
