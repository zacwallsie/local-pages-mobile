// src/constants/layout.ts
export const LAYOUT = {
	LOGO_SIZE: 80,
	get CIRCLE_SIZE() {
		return this.LOGO_SIZE * 1.5
	},
} as const
