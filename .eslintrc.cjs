/* eslint config for Astro + Svelte + TypeScript */
module.exports = {
	root: true,
	overrides: [
		{
			files: ["**/*.{ts,tsx,js,mjs,cjs}", "**/*.astro", "**/*.svelte"],
			parser: "@typescript-eslint/parser",
			extraFileExtensions: [".astro", ".svelte"],
			parserOptions: {
				sourceType: "module",
				ecmaVersion: 2022,
				project: false,
			},
			env: { browser: true, es2022: true, node: true },
			extends: [
				"eslint:recommended",
				"plugin:@typescript-eslint/recommended",
				"plugin:astro/recommended",
				"plugin:svelte/recommended",
				"plugin:@typescript-eslint/stylistic",
				"prettier",
			],
			settings: {
				"svelte3/typescript": () => require("typescript"),
			},
			rules: {
				"@typescript-eslint/no-unused-vars": [
					"warn",
					{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
				],
				"no-console": "off",
			},
		},
	],
};
