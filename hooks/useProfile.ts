import { useState, useEffect } from "react"
import { useRouter } from "expo-router"
import { supabase } from "@/supabase"
import { ProfileState, ProfileFormData, MobileUser } from "@/types/user"

/**
 * Custom React hook for managing user profile operations with Supabase authentication.
 * @returns {Object} Object containing user session, profile data, loading state, error state, and profile management functions
 * @property {Session | null} session - Current Supabase session
 * @property {MobileUser | null} mobileUser - Current mobile user profile data
 * @property {boolean} loading - Loading state indicator
 * @property {string} error - Error message if any
 * @property {Function} updateProfile - Function to update user profile
 * @property {Function} deleteAccount - Function to delete user account
 * @property {Function} signOut - Function to sign out user
 */
export const useProfile = () => {
	const [state, setState] = useState<ProfileState>({
		session: null,
		mobileUser: null,
		loading: true,
		error: "",
	})
	const router = useRouter()

	/**
	 * Fetches mobile user data from Supabase for a given user ID
	 * @param {string} userId - The ID of the user whose data to fetch
	 * @returns {Promise<void>}
	 */
	const fetchMobileUser = async (userId: string) => {
		try {
			const { data, error } = await supabase.from("mobile_user").select("*").eq("user_id", userId).single()

			if (error) throw error

			setState((prev) => ({
				...prev,
				mobileUser: data,
				loading: false,
			}))
		} catch (err) {
			setState((prev) => ({
				...prev,
				error: err instanceof Error ? err.message : "Failed to load user profile",
				loading: false,
			}))
		}
	}

	useEffect(() => {
		/**
		 * Fetches and sets up the initial session state
		 * @returns {Promise<void>}
		 */
		const getSession = async () => {
			try {
				const { data, error } = await supabase.auth.getSession()
				if (error) throw error

				setState((prev) => ({ ...prev, session: data.session }))

				if (data.session?.user) {
					await fetchMobileUser(data.session.user.id)
				} else {
					router.replace("/")
				}
			} catch (err) {
				setState((prev) => ({
					...prev,
					error: err instanceof Error ? err.message : "Failed to load profile",
					loading: false,
				}))
			}
		}

		getSession()

		const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
			setState((prev) => ({ ...prev, session: newSession }))

			if (newSession?.user) {
				await fetchMobileUser(newSession.user.id)
			} else {
				router.replace("/")
			}
		})

		return () => {
			authListener.subscription.unsubscribe()
		}
	}, [router])

	/**
	 * Updates user profile information in Supabase
	 * @param {ProfileFormData} formData - Object containing firstName and lastName
	 * @returns {Promise<boolean>} True if update successful, false otherwise
	 * @throws Will throw an error if update fails
	 */
	const updateProfile = async (formData: ProfileFormData): Promise<boolean> => {
		if (!state.session?.user) return false

		try {
			setState((prev) => ({ ...prev, loading: true, error: "" }))

			const { error } = await supabase
				.from("mobile_user")
				.update({
					first_name: formData.firstName,
					last_name: formData.lastName,
				})
				.eq("user_id", state.session.user.id)

			if (error) throw error

			await fetchMobileUser(state.session.user.id)
			return true
		} catch (err) {
			setState((prev) => ({
				...prev,
				error: err instanceof Error ? err.message : "An error occurred",
				loading: false,
			}))
			return false
		}
	}

	/**
	 * Deletes user account from Supabase and signs out
	 * @returns {Promise<boolean>} True if deletion successful, false otherwise
	 * @throws Will throw an error if deletion fails
	 */
	const deleteAccount = async (): Promise<boolean> => {
		if (!state.session?.user) return false

		try {
			setState((prev) => ({ ...prev, loading: true, error: "" }))

			const { error } = await supabase.from("mobile_user").delete().eq("user_id", state.session.user.id)

			if (error) throw error

			await signOut()
			return true
		} catch (err) {
			setState((prev) => ({
				...prev,
				error: err instanceof Error ? err.message : "An error occurred",
				loading: false,
			}))
			return false
		}
	}

	/**
	 * Signs out the current user and redirects to home page
	 * @returns {Promise<void>}
	 * @throws Will throw an error if sign out fails
	 */
	const signOut = async (): Promise<void> => {
		const { error } = await supabase.auth.signOut()
		if (error) {
			setState((prev) => ({ ...prev, error: error.message }))
		} else {
			router.replace("/")
		}
	}

	return {
		...state,
		updateProfile,
		deleteAccount,
		signOut,
	}
}
