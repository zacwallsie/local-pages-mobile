// src/hooks/useAuthUser.ts
import { useState, useEffect } from "react"
import { supabase } from "@/supabase"
import { useRouter } from "expo-router"

interface AuthUser {
	id: string
	email: string
}

interface AuthState {
	user: AuthUser | null
	loading: boolean
	error: string | null
}

export const useAuthUser = () => {
	const [state, setState] = useState<AuthState>({
		user: null,
		loading: true,
		error: null,
	})
	const router = useRouter()

	useEffect(() => {
		const checkUser = async () => {
			try {
				const {
					data: { user },
					error,
				} = await supabase.auth.getUser()

				if (error) throw error

				if (!user || !user.email) {
					router.replace("/")
					return
				}

				setState({
					user: {
						id: user.id,
						email: user.email,
					},
					loading: false,
					error: null,
				})
			} catch (err) {
				setState({
					user: null,
					loading: false,
					error: err instanceof Error ? err.message : "Failed to fetch user",
				})
			}
		}

		checkUser()
	}, [router])

	return state
}
