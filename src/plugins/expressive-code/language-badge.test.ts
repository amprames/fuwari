import { describe, expect, it } from "vitest";

describe("language-badge plugin", () => {
	it("should be a function", () => {
		// This is a basic test to ensure the plugin exports correctly
		expect(typeof require("./language-badge")).toBe("function");
	});

	it("should return a plugin object", () => {
		const plugin = require("./language-badge");
		const result = plugin();

		expect(result).toBeDefined();
		expect(typeof result).toBe("object");
	});
});
