// src/components/profile/ProfileHeader.tsx
import React from "react"
import { View, StyleSheet } from "react-native"
import { Avatar, Text } from "react-native-paper"
import { Colors } from "@/constants/Colors"
import { MobileUser } from "@/types/user"

interface ProfileHeaderProps {
	user: MobileUser
	email: string
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, email }) => {
	const avatarLabel = user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0).toUpperCase()

	return (
		<View style={styles.container}>
			<Avatar.Text size={80} label={avatarLabel} style={styles.avatar} color={Colors.white} />
			<Text variant="headlineSmall" style={styles.name}>
				{user.first_name} {user.last_name}
			</Text>
			<Text variant="bodyLarge" style={styles.email}>
				{email}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
	},
	avatar: {
		backgroundColor: Colors.blue.DEFAULT,
	},
	name: {
		marginTop: 16,
		fontWeight: "600",
		color: Colors.dark_blue.DEFAULT,
	},
	email: {
		marginTop: 8,
		color: Colors.slate.DEFAULT,
	},
})
