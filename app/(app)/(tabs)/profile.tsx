// app/(tabs)/profile.tsx

import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { supabase } from "../../../supabase"
import { Session } from "@supabase/supabase-js"
import { Text, Button, Avatar } from "react-native-paper"
import { Colors } from "@/constants/Colors"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function ProfileScreen() {
	const [session, setSession] = useState<Session | null>(null)
	const router = useRouter()
	const insets = useSafeAreaInsets()

	useEffect(() => {
		const getSession = async () => {
			const { data } = await supabase.auth.getSession()
			setSession(data.session)
		}

		getSession()
	}, [])

	const handleSignOut = async () => {
		const { error } = await supabase.auth.signOut()
		if (error) {
			alert(error.message)
		} else {
			router.replace("/")
		}
	}

	if (!session) {
		return null
	}

	const userEmail = session.user.email || ""
	const avatarLabel = userEmail.charAt(0).toUpperCase()

	return (
		<View style={{ flex: 1, alignItems: "center", paddingTop: insets.top + 32 }}>
			<Avatar.Text size={80} label={avatarLabel} style={{ backgroundColor: Colors.blue.DEFAULT }} />
			<Text variant="headlineSmall" style={{ marginTop: 16 }}>
				{userEmail}
			</Text>
			<Button mode="contained" onPress={handleSignOut} style={{ marginTop: 32 }} contentStyle={{ paddingVertical: 8 }}>
				Sign Out
			</Button>
		</View>
	)
}
