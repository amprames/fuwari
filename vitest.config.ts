import { svelte } from "@sveltejs/vite-plugin-svelte";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		svelte({ hot: !process.env.VITEST }),
		// Usa los paths definidos en tsconfig.json
		tsconfigPaths(),
	],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./src/test/setup.ts"],
		include: ["src/**/*.{test,spec}.{js,ts,svelte}"],
		exclude: ["node_modules", "dist", ".astro"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"src/test/",
				"**/*.d.ts",
				"**/*.config.*",
				"**/coverage/**",
				"**/*.astro",
			],
			thresholds: {
				lines: 80,
				functions: 70,
				branches: 70,
				statements: 80,
			},
		},
	},
	resolve: {
		// Mover los alias a tsconfig.json
		alias: [
			// Permitir resolver "astro:content" durante tests
			{
				find: "astro:content",
				replacement: "/src/test/mocks/astro-content.ts",
			},
		],
	},
});
