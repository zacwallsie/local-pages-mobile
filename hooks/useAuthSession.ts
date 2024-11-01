// src/hooks/useAuthSession.ts
import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"
import { supabase } from "@/supabase"

interface AuthSessionState {
	session: Session | null
	loading: boolean
	error: Error | null
}

/**
 * Custom hook to manage authentication session state
 * @returns Object containing session state, loading state, and error state
 */
export const useAuthSession = (): AuthSessionState => {
	const [state, setState] = useState<AuthSessionState>({
		session: null,
		loading: true,
		error: null,
	})

	useEffect(() => {
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

		interface AuthListener {
			subscription: {
				unsubscribe: () => void
			}
		}

		const { data: authListener }: { data: AuthListener } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
			setState((prev) => ({ ...prev, session }))
		})

		return () => {
			authListener.subscription.unsubscribe()
		}
	}, [])

	return state
}
