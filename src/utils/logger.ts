// src/utils/logger.ts
export function logDev(...args: unknown[]) {
	// import.meta.env.DEV is the recommended way in Vite/Astro to detect dev mode
	if (
		typeof import.meta !== "undefined" &&
		import.meta.env &&
		import.meta.env.DEV
	) {
		console.log(...args);
	}
}
