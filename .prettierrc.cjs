module.exports = {
	plugins: ["prettier-plugin-astro", "prettier-plugin-svelte"],
	printWidth: 100,
	singleQuote: false,
	semi: true,
	trailingComma: "all",
	overrides: [
		{ files: "**/*.astro", options: { parser: "astro" } },
		{ files: "**/*.svelte", options: { parser: "svelte" } },
	],
};
