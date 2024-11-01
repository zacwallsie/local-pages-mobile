// src/services/user.ts
import { supabase } from "@/supabase"
import { MobileUser, UserProfile } from "@/types/user"

interface ProfileResponse {
	success: boolean
	error?: string
}

export const userService = {
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
	 * Checks if a mobile user profile exists for the given user ID
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
