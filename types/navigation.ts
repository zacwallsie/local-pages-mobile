import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons"

/**
 * Represents the configuration for a tab in the navigation system.
 *
 * @interface TabConfig
 * @property {string} name - The internal name/identifier for the tab route.
 * @property {string} title - The display title shown in the UI for the tab.
 * @property {keyof typeof MaterialCommunityIcons.glyphMap} iconName - The name of the Material Community icon to display.
 *                                                                     Must be a valid icon name from the MaterialCommunityIcons set.
 * @example
 * const tabConfig: TabConfig = {
 *   name: "home",
 *   title: "Home",
 *   iconName: "home"
 * }
 */
export type TabConfig = {
	name: string
	title: string
	iconName: keyof typeof MaterialCommunityIcons.glyphMap
}
