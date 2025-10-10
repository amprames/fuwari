import { defineConfig } from "cypress";
import cypressMochawesomeReporter from "cypress-mochawesome-reporter/plugin";

export default defineConfig({
	video: false,
	screenshotOnRunFailure: true,
	e2e: {
		baseUrl: "http://localhost:4321",
		specPattern: "cypress/e2e/**/*.cy.ts",
		supportFile: "cypress/support/e2e.ts",
		viewportWidth: 1280,
		viewportHeight: 800,
		testIsolation: true,
		retries: { runMode: 1, openMode: 0 },
		setupNodeEvents(on, config) {
			cypressMochawesomeReporter(on);
			return config;
		},
	},
	reporter: "cypress-mochawesome-reporter",
	reporterOptions: {
		reportDir: "cypress/reports",
		charts: true,
		reportPageTitle: "E2E Report",
		embeddedScreenshots: true,
		inlineAssets: true,
		overwrite: false,
		saveJson: true,
	},
});
