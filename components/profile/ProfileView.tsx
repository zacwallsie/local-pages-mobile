// src/components/profile/ProfileView.tsx
import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Colors } from "@/constants/Colors"
import { useProfile } from "@/hooks/useProfile"
import { ProfileHeader } from "./ProfileHeader"
import { ProfileEditForm, ProfileFormData } from "./ProfileEditForm"
import { ProfileActions } from "./ProfileActions"
import { DeleteAccountDialog } from "./DeleteAccountDialog"
import { LoadingState } from "../common/LoadingState"
import { ErrorState } from "../common/ErrorState"

export default function ProfileView() {
	const insets = useSafeAreaInsets()
	const { session, mobileUser, loading, error, updateProfile, deleteAccount, signOut } = useProfile()

	const [editMode, setEditMode] = useState(false)
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)

	if (loading) {
		return <LoadingState message="Loading profile..." />
	}

	if (error) {
		return <ErrorState message={error} onRetry={signOut} />
	}

	if (!session || !mobileUser) {
		return <ErrorState message="No profile found. Please sign in again." onRetry={signOut} />
	}

	const handleUpdateProfile = async (data: ProfileFormData) => {
		const success = await updateProfile(data)
		if (success) setEditMode(false)
	}

	const handleDeleteAccount = async () => {
		const success = await deleteAccount()
		if (success) setShowDeleteDialog(false)
		return success
	}

	return (
		<View style={[styles.container, { paddingTop: insets.top + 32 }]}>
			<ProfileHeader user={mobileUser} email={session.user.email || ""} />

			{editMode ? (
				<ProfileEditForm
					formData={{
						firstName: mobileUser.first_name,
						lastName: mobileUser.last_name,
					}}
					loading={loading}
					error={error}
					onSubmit={handleUpdateProfile}
					onCancel={() => setEditMode(false)}
				/>
			) : (
				<ProfileActions onEdit={() => setEditMode(true)} onSignOut={signOut} onDeleteRequest={() => setShowDeleteDialog(true)} />
			)}

			<DeleteAccountDialog
				visible={showDeleteDialog}
				loading={loading}
				onConfirm={handleDeleteAccount}
				onDismiss={() => setShowDeleteDialog(false)}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.offwhite,
	},
})
