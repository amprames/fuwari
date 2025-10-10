import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
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
			],
		},
	},
	resolve: {
		alias: {
			"@": "/src",
			"@utils": "/src/utils",
			"@components": "/src/components",
			"@stores": "/src/stores",
			"@constants": "/src/constants",
			"@i18n": "/src/i18n",
			// Permitir resolver "astro:content" durante tests
			"astro:content": "/src/test/mocks/astro-content.ts",
		},
	},
});
