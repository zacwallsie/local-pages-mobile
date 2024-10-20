// app/auth/sign-up.tsx

import React, { useState } from "react"
import { View } from "react-native"
import { supabase } from "../../supabase"
import { Link, useRouter } from "expo-router"
import { TextInput, Button, Text, HelperText } from "react-native-paper"
import { Colors } from "@/constants/Colors"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function SignUpScreen() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const router = useRouter()
	const insets = useSafeAreaInsets()

	const handleSignUp = async () => {
		setLoading(true)
		setError("")
		const { error } = await supabase.auth.signUp({ email, password })
		if (error) {
			setError(error.message)
		} else {
			alert("Check your email for the confirmation link!")
			router.replace("/sign-in")
		}
		setLoading(false)
	}

	return (
		<View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 16, paddingTop: insets.top }}>
			<Text variant="headlineLarge" style={{ marginBottom: 16, textAlign: "center" }}>
				Sign Up
			</Text>
			<TextInput
				label="Email"
				value={email}
				onChangeText={setEmail}
				autoCapitalize="none"
				keyboardType="email-address"
				style={{ marginBottom: 8 }}
				mode="outlined"
			/>
			<TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 8 }} mode="outlined" />
			{error ? <HelperText type="error">{error}</HelperText> : null}
			<Button
				mode="contained"
				onPress={handleSignUp}
				style={{ marginVertical: 8 }}
				loading={loading}
				disabled={loading}
				contentStyle={{ paddingVertical: 8 }}
			>
				Sign Up
			</Button>
			<Link href="/sign-in" style={{ marginTop: 16, alignSelf: "center" }}>
				<Text variant="bodyLarge" style={{ color: Colors.blue.DEFAULT }}>
					Already have an account? Sign In
				</Text>
			</Link>
		</View>
	)
}
