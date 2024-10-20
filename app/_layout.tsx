// app/_layout.tsx

import { Slot } from "expo-router"
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Colors } from "@/constants/Colors"

export default function RootLayout() {
	const theme = {
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
	}

	return (
		<PaperProvider theme={theme}>
			<SafeAreaProvider>
				<Slot />
			</SafeAreaProvider>
		</PaperProvider>
	)
}
