import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"
import { supabase } from "@/supabase"

/**
 * State interface for authentication session management
 */
interface AuthSessionState {
	/** Current Supabase session if authenticated */
	session: Session | null
	/** Loading state indicator */
	loading: boolean
	/** Error object if session fetch fails */
	error: Error | null
}

/**
 * Interface for Supabase authentication listener
 */
interface AuthListener {
	subscription: {
		unsubscribe: () => void
	}
}

/**
 * Custom hook that manages Supabase authentication session state.
 * Handles initial session fetch and subscribes to authentication state changes.
 *
 * @returns {AuthSessionState} Current authentication session state
 */
export const useAuthSession = (): AuthSessionState => {
	const [state, setState] = useState<AuthSessionState>({
		session: null,
		loading: true,
		error: null,
	})

	useEffect(() => {
		/**
		 * Fetches initial session state from Supabase
		 */
		const getInitialSession = async () => {
			try {
				const { data, error } = await supabase.auth.getSession()
				if (error) throw error

				setState((prev) => ({
					...prev,
					session: data.session,
					loading: false,
				}))
			} catch (error) {
				setState((prev) => ({
					...prev,
					error: error as Error,
					loading: false,
				}))
			}
		}

		getInitialSession()

		// Set up authentication state change listener
		const { data: authListener }: { data: AuthListener } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
			setState((prev) => ({ ...prev, session }))
		})

		// Cleanup subscription on unmount
		return () => {
			authListener.subscription.unsubscribe()
		}
	}, [])

	return state
}
