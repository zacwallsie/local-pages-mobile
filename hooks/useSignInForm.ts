// src/hooks/useSignInForm.ts
import { useState } from "react"
import { useRouter } from "expo-router"
import { authService } from "@/services/auth"
import { userService } from "@/services/user"
import { SignInCredentials } from "@/types/auth"

interface SignInState {
	credentials: SignInCredentials
	loading: boolean
	error: string
	updateField: (field: keyof SignInCredentials, value: string) => void
	handleSignIn: () => Promise<void>
}

export const useSignInForm = (): SignInState => {
	const router = useRouter()
	const [credentials, setCredentials] = useState<SignInCredentials>({
		email: "",
		password: "",
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const updateField = (field: keyof SignInCredentials, value: string) => {
		setCredentials((prev) => ({ ...prev, [field]: value }))
		setError("")
	}

	const handleSignIn = async () => {
		try {
			setLoading(true)
			setError("")

			const authResponse = await authService.signIn(credentials)

			if (!authResponse.success || !authResponse.userId) {
				throw new Error(authResponse.error || "Authentication failed")
			}

			const hasMobileUser = await userService.checkMobileUserExists(authResponse.userId)

			router.replace(hasMobileUser ? "/search" : "/mobile-sign-up")
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred during sign in")
		} finally {
			setLoading(false)
		}
	}

	return {
		credentials,
		loading,
		error,
		updateField,
		handleSignIn,
	}
}
