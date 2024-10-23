import React, { useEffect, useRef } from "react"
import { View, StyleSheet, Animated } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface CustomMarkerProps {
	size?: number
}

export const CustomMarker = ({ size = 40 }: CustomMarkerProps) => {
	const pulseAnim = useRef(new Animated.Value(1)).current

	useEffect(() => {
		const pulse = Animated.sequence([
			Animated.timing(pulseAnim, {
				toValue: 1.2,
				duration: 1000,
				useNativeDriver: true,
			}),
			Animated.timing(pulseAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}),
		])

		Animated.loop(pulse).start()
	}, [])

	return (
		<View style={styles.markerContainer}>
			<Animated.View
				style={[
					styles.pulse,
					{
						transform: [{ scale: pulseAnim }],
						width: size * 1.5,
						height: size * 1.5,
					},
				]}
			/>
			<View style={[styles.marker, { width: size, height: size }]}>
				<MaterialCommunityIcons name="map-marker" size={size} color="#7C97B6" />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	markerContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	pulse: {
		position: "absolute",
		backgroundColor: "rgba(124, 151, 182, 0.2)", // blue.DEFAULT with opacity
		borderRadius: 100,
	},
	marker: {
		alignItems: "center",
		justifyContent: "center",
	},
})
