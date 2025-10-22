import { describe, expect, it } from "vitest";
import { formatDateToYYYYMMDD } from "./date-utils";

describe("date-utils", () => {
	describe("formatDateToYYYYMMDD", () => {
		it("should format date correctly", () => {
			const date = new Date("2024-01-15T10:30:00Z");
			const result = formatDateToYYYYMMDD(date);
			expect(result).toBe("2024-01-15");
		});

		it("should handle single digit months and days", () => {
			const date = new Date("2024-03-05T10:30:00Z");
			const result = formatDateToYYYYMMDD(date);
			expect(result).toBe("2024-03-05");
		});

		it("should handle end of year dates", () => {
			const date = new Date("2023-12-31T23:59:59Z");
			const result = formatDateToYYYYMMDD(date);
			expect(result).toBe("2023-12-31");
		});

		it("should handle leap year dates", () => {
			const date = new Date("2024-02-29T12:00:00Z");
			const result = formatDateToYYYYMMDD(date);
			expect(result).toBe("2024-02-29");
		});

		it("should handle beginning of year dates", () => {
			const date = new Date("2024-01-01T00:00:00Z");
			const result = formatDateToYYYYMMDD(date);
			expect(result).toBe("2024-01-01");
		});
	});
});
