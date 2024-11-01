// /components/shared/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text } from "react-native-paper"

interface Props {
	children: ReactNode
}

interface State {
	hasError: boolean
	error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	}

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo)
	}

	private handleReset = () => {
		this.setState({ hasError: false, error: null })
	}

	public render() {
		if (this.state.hasError) {
			return (
				<View style={styles.errorContainer}>
					<Text style={styles.errorTitle}>Something went wrong</Text>
					<Text style={styles.errorMessage}>{this.state.error?.message}</Text>
					<Button mode="contained" onPress={this.handleReset} style={styles.resetButton}>
						Try Again
					</Button>
				</View>
			)
		}

		return this.props.children
	}
}

const styles = StyleSheet.create({
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
	},
	errorMessage: {
		textAlign: "center",
		marginBottom: 20,
	},
	resetButton: {
		marginTop: 10,
	},
})
