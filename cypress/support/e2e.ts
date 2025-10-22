// Import commands if needed later
import "./commands";

// Ensure uncaught exceptions don't fail tests unless relevant
Cypress.on("uncaught:exception", (_err) => {
	// Allow 3rd-party script errors unrelated to our app
	return false;
});

// Register mochawesome reporter hooks
import "cypress-mochawesome-reporter/register";

// Global network stubbing state
const networkStubs = new Map<string, unknown>();

// Add custom commands for network stubbing
declare global {
	namespace Cypress {
		interface Chainable {
			/**
			 * Stub a network request with the given URL and response
			 * @param method HTTP method to intercept (default: 'GET')
			 * @param url URL to intercept (supports glob patterns)
			 * @param response Response to return (or a function that returns a response)
			 * @param options Additional options for the intercept
			 */
			stubRequest(
				method: string,
				url: string,
				response: unknown,
				options?: {
					statusCode?: number;
					headers?: Record<string, string>;
					delayMs?: number;
				},
			): Chainable<void>;

			/**
			 * Wait for all network requests to complete
			 * @param timeout Timeout in milliseconds (default: 10000)
			 */
			waitForNetworkIdle(timeout?: number): Chainable<void>;
		}
	}
}

// Implement the stubRequest command
Cypress.Commands.add(
	"stubRequest",
	(method = "GET", url, response, options = {}) => {
		const { statusCode = 200, headers = {}, delayMs = 0 } = options;

		// Register the stub
		networkStubs.set(`${method}:${url}`, {
			response,
			statusCode,
			headers,
			delayMs,
		});

		// Set up the intercept
		cy.intercept(method, url, (req) => {
			const stub = networkStubs.get(`${method}:${url}`);
			if (!stub) return req.continue();

			const response =
				typeof stub.response === "function"
					? stub.response(req)
					: stub.response;

			req.reply({
				statusCode: stub.statusCode,
				body: response,
				headers: {
					"content-type": "application/json",
					...stub.headers,
				},
				delay: stub.delayMs,
			});
		}).as(`stub:${method.toLowerCase()}:${url}`);
	},
);

// Implement waitForNetworkIdle command
Cypress.Commands.add("waitForNetworkIdle", (timeout = 10000) => {
	const log = Cypress.log({
		name: "waitForNetworkIdle",
		displayName: "Wait for Network Idle",
		message: `Waiting ${timeout}ms for network to be idle`,
		autoEnd: false,
	});

	const startTime = Date.now();
	let idleStart = startTime;
	let requestCount = 0;
	let _isIdle = false;

	const checkIdle = (resolve: (value: undefined) => void) => {
		const now = Date.now();
		const elapsed = now - startTime;
		const idleTime = now - idleStart;

		if (idleTime >= 1000) {
			// If we've been idle for 1 second, consider the network idle
			_isIdle = true;
			log.set("consoleProps", () => ({
				"Requests Handled": requestCount,
				"Time Elapsed": `${elapsed}ms`,
				"Idle Time": `${idleTime}ms`,
			}));
			log.end();
			return resolve();
		}

		if (elapsed >= timeout) {
			log.set("consoleProps", () => ({
				"Requests Handled": requestCount,
				"Time Elapsed": `${elapsed}ms`,
				"Idle Time": `${idleTime}ms`,
				Warning: "Timed out waiting for network idle",
			}));
			log.end();
			return resolve();
		}

		setTimeout(() => checkIdle(resolve), 100);
	};

	// Listen to network requests
	cy.intercept("*", (req) => {
		requestCount++;
		idleStart = Date.now();
		req.continue();
	});

	return new Promise<void>((resolve) => {
		// Start checking for idle
		setTimeout(() => checkIdle(resolve), 100);
	});
});
