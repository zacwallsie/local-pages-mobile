// src/types/auth.ts
import { Session } from "@supabase/supabase-js"
1
export interface SignUpFormData {
	email: string
	password: string
	firstName: string
	lastName: string
}

export interface ValidationError {
	field: keyof SignUpFormData
	message: string
}

export interface SignInCredentials {
	email: string
	password: string
}

export interface AuthError {
	message: string
}

export interface AuthLayoutProps {
	children?: React.ReactNode
}

export type AuthStateChangeHandler = (session: Session | null) => Promise<void>
