import { supabase } from "@/supabase"
import { UserProfile } from "@/types/user"

/**
 * Response interface for profile operations
 */
interface ProfileResponse {
	/** Indicates if the profile operation was successful */
	success: boolean
	/** Error message if operation failed */
	error?: string
}

/**
 * Service for managing user profile operations in Supabase
 */
export const userService = {
	/**
	 * Creates a new mobile user profile in the database
	 * @param {string} userId - User's authentication ID
	 * @param {string} email - User's email address
	 * @param {UserProfile} profile - User's profile information
	 * @returns {Promise<ProfileResponse>} Result of profile creation
	 */
	async createMobileUser(userId: string, email: string, profile: UserProfile): Promise<ProfileResponse> {
		try {
			const { error } = await supabase.from("mobile_user").insert([
				{
					user_id: userId,
					first_name: profile.firstName,
					last_name: profile.lastName,
					email: email,
				},
			])

			if (error) throw error

			return { success: true }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to create profile",
			}
		}
	},

	/**
	 * Verifies existence of a mobile user profile
	 * @param {string} userId - User's authentication ID
	 * @returns {Promise<boolean>} True if profile exists, false otherwise
	 */
	async checkMobileUserExists(userId: string): Promise<boolean> {
		try {
			const { data, error } = await supabase.from("mobile_user").select("*").eq("user_id", userId).single()

			if (error || !data) {
				return false
			}

			return true
		} catch {
			return false
		}
	},
}
