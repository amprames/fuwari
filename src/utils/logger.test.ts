import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logDev } from "./logger";

describe("logger", () => {
	let consoleSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		consoleSpy.mockRestore();
	});

	describe("logDev", () => {
		it("should log in development mode", () => {
			// Mock import.meta.env.DEV to true
			Object.defineProperty(import.meta, "env", {
				value: { DEV: true },
				writable: true,
			});

			logDev("test message", { key: "value" });

			expect(consoleSpy).toHaveBeenCalledWith("test message", { key: "value" });
		});

		it("should not log in production mode", () => {
			// Mock import.meta.env.DEV to false
			Object.defineProperty(import.meta, "env", {
				value: { DEV: false },
				writable: true,
			});

			logDev("test message");

			expect(consoleSpy).not.toHaveBeenCalled();
		});

		it("should handle multiple arguments", () => {
			Object.defineProperty(import.meta, "env", {
				value: { DEV: true },
				writable: true,
			});

			logDev("arg1", "arg2", { key: "value" });

			expect(consoleSpy).toHaveBeenCalledWith("arg1", "arg2", { key: "value" });
		});

		it("should handle undefined import.meta.env", () => {
			// Mock import.meta.env as undefined
			Object.defineProperty(import.meta, "env", {
				value: undefined,
				writable: true,
			});

			logDev("test message");

			expect(consoleSpy).not.toHaveBeenCalled();
		});
	});
});
