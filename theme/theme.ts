// src/theme/theme.ts
import { DefaultTheme } from "react-native-paper"
import { Colors } from "@/constants/Colors"

/**
 * Application-wide theme configuration extending React Native Paper's DefaultTheme
 */
export const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: Colors.blue.DEFAULT,
		accent: Colors.red.DEFAULT,
		background: Colors.offwhite,
		surface: Colors.white,
		text: Colors.darks.dark,
		placeholder: Colors.slate.light,
	},
} as const
