import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { visualizer } from "rollup-plugin-visualizer";
import { expressiveCodeConfig } from "./src/config.ts";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
	site: "https://fuwari.vercel.app/",
	base: "/",
	trailingSlash: "always",
	integrations: [
		tailwind({
			nesting: true,
		}),
		swup({
			theme: false,
			animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
			// the default value `transition-` cause transition delay
			// when the Tailwind class `transition-all` is used
			containers: ["main", "#toc"],
			smoothScrolling: true,
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
		}),
		icon({
			include: {
				"fa6-brands": ["github", "linkedin", "twitter", "mastodon", "steam", "creative-commons"],
				"fa6-regular": ["envelope", "copyright", "address-card"],
				"fa6-solid": [
					"arrow-rotate-left",
					"rss",
					"link",
					"tag",
					"calendar",
					"arrow-up-right-from-square",
				],
				"material-symbols": [
					"search",
					"wb-sunny-outline-rounded",
					"dark-mode-outline-rounded",
					"settings-outline-rounded",
					"close-rounded",
					"expand-more-rounded",
					"expand-less-rounded",
					"arrow-back-rounded",
					"arrow-forward-rounded",
					"keyboard-arrow-up-rounded",
					"home-outline-rounded",
					"palette-outline",
					"error-outline",
					"refresh",
					"search-off",
					"home",
					"library-books",
					"arrow-back",
					"calendar-today-outline-rounded",
					"edit-calendar-outline-rounded",
					"book-2-outline-rounded",
					"tag-rounded",
					"notes-rounded",
					"schedule-outline-rounded",
					"chevron-left-rounded",
					"chevron-right-rounded",
					"copyright-outline-rounded",
					"more-horiz",
					"menu-rounded",
					"radio-button-partial-outline",
				],
			},
		}),
		expressiveCode({
			themes: [expressiveCodeConfig.theme, expressiveCodeConfig.theme],
			plugins: [
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				pluginLanguageBadge(),
				pluginCustomCopyButton(),
			],
			defaultProps: {
				wrap: true,
				overridesByLang: {
					shellsession: {
						showLineNumbers: false,
					},
				},
			},
			styleOverrides: {
				codeBackground: "var(--codeblock-bg)",
				borderRadius: "0.75rem",
				borderColor: "none",
				codeFontSize: "0.875rem",
				codeFontFamily:
					"'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
				codeLineHeight: "1.5rem",
				frames: {
					editorBackground: "var(--codeblock-bg)",
					terminalBackground: "var(--codeblock-bg)",
					terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
					editorTabBarBackground: "var(--codeblock-topbar-bg)",
					editorActiveTabBackground: "none",
					editorActiveTabIndicatorBottomColor: "var(--primary)",
					editorActiveTabIndicatorTopColor: "none",
					editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
					terminalTitlebarBorderBottomColor: "none",
				},
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
				},
			},
			frames: {
				showCopyToClipboardButton: false,
			},
		}),
		svelte(),
		sitemap(),
	],
	markdown: {
		remarkPlugins: [
			remarkMath,
			remarkReadingTime,
			remarkExcerpt,
			remarkGithubAdmonitionsToDirectives,
			remarkDirective,
			remarkSectionize,
			parseDirectiveNode,
		],
		rehypePlugins: [
			rehypeKatex,
			rehypeSlug,
			[
				rehypeComponents,
				{
					components: {
						github: GithubCardComponent,
						note: (x, y) => AdmonitionComponent(x, y, "note"),
						tip: (x, y) => AdmonitionComponent(x, y, "tip"),
						important: (x, y) => AdmonitionComponent(x, y, "important"),
						caution: (x, y) => AdmonitionComponent(x, y, "caution"),
						warning: (x, y) => AdmonitionComponent(x, y, "warning"),
					},
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					behavior: "append",
					properties: {
						className: ["anchor"],
						"aria-hidden": "true",
						tabIndex: -1,
					},
					content: {
						type: "element",
						tagName: "span",
						properties: {
							className: ["anchor-icon"],
							"data-pagefind-ignore": true,
						},
						children: [
							{
								type: "element",
								tagName: "svg",
								properties: {
									xmlns: "http://www.w3.org/2000/svg",
									width: 24,
									height: 24,
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									"stroke-width": "2",
									"stroke-linecap": "round",
									"stroke-linejoin": "round",
									"aria-hidden": "true",
								},
								children: [
									{
										type: "element",
										tagName: "path",
										properties: {
											d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
										},
									},
									{
										type: "element",
										tagName: "path",
										properties: {
											d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
										},
									},
								],
							},
							{
								type: "element",
								tagName: "span",
								properties: {
									className: ["sr-only"],
								},
								children: [
									{
										type: "text",
										value: "Enlace a esta sección",
									},
								],
							},
						],
					},
				},
			],
		],
	},
	vite: {
		plugins: [
			visualizer({
				emitFile: true,
				filename: "stats.html",
				gzipSize: true,
				brotliSize: true,
			}),
		],
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					// temporarily suppress this warning
					if (
						warning.message.includes("is dynamically imported by") &&
						warning.message.includes("but also statically imported by")
					) {
						return;
					}
					warn(warning);
				},
				output: {
					manualChunks: {
						// Core framework chunks
						"astro-core": ["astro"],
						"svelte-core": ["svelte", "@astrojs/svelte"],

						// UI and styling libraries
						"ui-libs": ["@swup/astro", "overlayscrollbars", "photoswipe"],

						// Icon libraries (large bundle)
						icons: [
							"astro-icon",
							"@iconify/svelte",
							"@iconify-json/fa6-brands",
							"@iconify-json/fa6-regular",
							"@iconify-json/fa6-solid",
							"@iconify-json/material-symbols",
						],

						// Markdown and content processing
						"markdown-processing": [
							"markdown-it",
							"remark-directive",
							"remark-math",
							"remark-sectionize",
							"remark-github-admonitions-to-directives",
							"rehype-autolink-headings",
							"rehype-components",
							"rehype-katex",
							"rehype-slug",
							"mdast-util-to-string",
							"unist-util-visit",
							"hastscript",
						],

						// Math and code highlighting
						"math-and-code": [
							"katex",
							"astro-expressive-code",
							"@expressive-code/core",
							"@expressive-code/plugin-collapsible-sections",
							"@expressive-code/plugin-line-numbers",
						],

						// Fonts (can be large)
						fonts: ["@fontsource-variable/jetbrains-mono", "@fontsource/roboto"],

						// Utilities and smaller libraries
						utils: ["reading-time", "sanitize-html", "sharp"],

						// CSS and styling
						styling: ["tailwindcss", "@tailwindcss/typography", "stylus"],
					},
					// Optimize chunk file names for better caching
					chunkFileNames: (chunkInfo) => {
						const _facadeModuleId = chunkInfo.facadeModuleId
							? chunkInfo.facadeModuleId
									.split("/")
									.pop()
									.replace(/\.[^/.]+$/, "")
							: "chunk";
						return `assets/js/[name]-[hash].js`;
					},
					// Optimize asset file names
					assetFileNames: (assetInfo) => {
						const info = assetInfo.name.split(".");
						const ext = info[info.length - 1];
						if (/\.(css)$/.test(assetInfo.name)) {
							return `assets/css/[name]-[hash].${ext}`;
						}
						if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
							return `assets/images/[name]-[hash].${ext}`;
						}
						if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
							return `assets/fonts/[name]-[hash].${ext}`;
						}
						return `assets/[name]-[hash].${ext}`;
					},
				},
			},
		},
	},
});
