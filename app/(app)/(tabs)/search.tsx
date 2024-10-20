// app/(tabs)/search.tsx

import React, { useState } from "react"
import { View, FlatList } from "react-native"
import { supabase } from "../../../supabase"
import { TextInput, Button, Text, Card, Avatar, ActivityIndicator, Snackbar } from "react-native-paper"
import { Colors } from "@/constants/Colors"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface Business {
	id: number
	name: string
	description: string
	service: string
	area: string
}

export default function SearchScreen() {
	const [service, setService] = useState("")
	const [area, setArea] = useState("")
	const [results, setResults] = useState<Business[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const insets = useSafeAreaInsets()

	const handleSearch = async () => {
		setLoading(true)
		setError("")
		const { data, error } = await supabase.from("businesses").select("*").ilike("service", `%${service}%`).ilike("area", `%${area}%`)

		if (error) {
			setError(error.message)
		} else {
			setResults(data as Business[])
		}
		setLoading(false)
	}

	return (
		<View style={{ flex: 1, paddingHorizontal: 16, paddingTop: insets.top + 16 }}>
			<TextInput
				label="Service"
				value={service}
				onChangeText={setService}
				style={{ marginBottom: 8 }}
				mode="outlined"
				placeholder="e.g., Plumbing"
			/>
			<TextInput label="Area" value={area} onChangeText={setArea} style={{ marginBottom: 8 }} mode="outlined" placeholder="e.g., New York" />
			<Button
				mode="contained"
				onPress={handleSearch}
				style={{ marginVertical: 8 }}
				loading={loading}
				disabled={loading}
				contentStyle={{ paddingVertical: 8 }}
			>
				Search
			</Button>

			{loading ? (
				<ActivityIndicator animating={true} style={{ marginTop: 16 }} />
			) : (
				<FlatList
					data={results}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={{ paddingBottom: 16 }}
					renderItem={({ item }) => (
						<Card style={{ marginBottom: 16 }}>
							<Card.Title
								title={item.name}
								left={() => <Avatar.Icon size={40} icon="store" style={{ backgroundColor: Colors.blue.DEFAULT }} />}
							/>
							<Card.Content>
								<Text variant="bodyMedium">{item.description}</Text>
								<Text variant="bodySmall" style={{ marginTop: 8 }}>
									Service: {item.service}
								</Text>
								<Text variant="bodySmall">Area: {item.area}</Text>
							</Card.Content>
						</Card>
					)}
					ListEmptyComponent={
						<Text style={{ textAlign: "center", marginTop: 16 }} variant="bodyLarge">
							No results found.
						</Text>
					}
				/>
			)}
			<Snackbar
				visible={!!error}
				onDismiss={() => setError("")}
				duration={3000}
				action={{
					label: "OK",
					onPress: () => setError(""),
				}}
			>
				{error}
			</Snackbar>
		</View>
	)
}
