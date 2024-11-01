// src/components/layout/AppStack.tsx
import React from "react"
import { Stack } from "expo-router"
import { STACK_OPTIONS } from "@/constants/Navigation"

interface AppStackProps {
	children?: React.ReactNode
}

/**
 * App stack component with default navigation options
 */
export const AppStack: React.FC<AppStackProps> = ({ children }) => <Stack screenOptions={STACK_OPTIONS.DEFAULT}>{children}</Stack>
