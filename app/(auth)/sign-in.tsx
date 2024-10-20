// app/auth/sign-in.tsx

import React, { useState } from "react"
import { View } from "react-native"
import { supabase } from "../../supabase"
import { Link, useRouter } from "expo-router"
import { TextInput, Button, Text, HelperText } from "react-native-paper"
import { Colors } from "@/constants/Colors"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function SignInScreen() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const insets = useSafeAreaInsets()

	const handleSignIn = async () => {
		setLoading(true)
		setError("")
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		if (error) {
			setError(error.message)
		} else {
			router.replace("/search")
		}
		setLoading(false)
	}

	return (
		<View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 16, paddingTop: insets.top }}>
			<Text variant="headlineLarge" style={{ marginBottom: 16, textAlign: "center" }}>
				Sign In
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
				onPress={handleSignIn}
				style={{ marginVertical: 8 }}
				loading={loading}
				disabled={loading}
				contentStyle={{ paddingVertical: 8 }}
			>
				Sign In
			</Button>
			<Link href="/sign-up" style={{ marginTop: 16, alignSelf: "center" }}>
				<Text variant="bodyLarge" style={{ color: Colors.blue.DEFAULT }}>
					Don't have an account? Sign Up
				</Text>
			</Link>
		</View>
	)
}
