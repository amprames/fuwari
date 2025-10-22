import { defineConfig } from "cypress";
import cypressMochawesomeReporter from "cypress-mochawesome-reporter/plugin";

export default defineConfig({
	video: false,
	screenshotOnRunFailure: true,
	defaultCommandTimeout: 10000, // 10 seconds
	pageLoadTimeout: 60000, // 60 seconds
	requestTimeout: 10000, // 10 seconds
	responseTimeout: 30000, // 30 seconds
	e2e: {
		baseUrl: "http://localhost:4321",
		specPattern: "cypress/e2e/**/*.cy.ts",
		supportFile: "cypress/support/e2e.ts",
		viewportWidth: 1280,
		viewportHeight: 800,
		testIsolation: true,
		experimentalStudio: false, // Explicitly disable experimental studio
		retries: { runMode: 1, openMode: 0 },
		setupNodeEvents(on, config) {
			cypressMochawesomeReporter(on);

			// Stub network requests for test data
			on("task", {
				intercept: (_url: string) => {
					// This will be used in tests with cy.task('intercept', url)
					return null;
				},
			});

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
