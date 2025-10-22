import { describe, expect, it } from "vitest";
import {
	generateCanonicalUrl,
	generateMetaTags,
	sanitizeDescription,
} from "./seo-utils";

describe("seo-utils", () => {
	describe("generateCanonicalUrl", () => {
		it("should generate canonical URL correctly", () => {
			const baseUrl = "https://example.com";
			const path = "/blog/post";
			const result = generateCanonicalUrl(baseUrl, path);
			expect(result).toBe("https://example.com/blog/post");
		});

		it("should handle trailing slashes", () => {
			const baseUrl = "https://example.com/";
			const path = "/blog/post/";
			const result = generateCanonicalUrl(baseUrl, path);
			expect(result).toBe("https://example.com/blog/post");
		});

		it("should handle empty path", () => {
			const baseUrl = "https://example.com";
			const path = "";
			const result = generateCanonicalUrl(baseUrl, path);
			expect(result).toBe("https://example.com");
		});
	});

	describe("sanitizeDescription", () => {
		it("should sanitize HTML tags", () => {
			const description = "<p>This is a <strong>test</strong> description</p>";
			const result = sanitizeDescription(description);
			expect(result).toBe("This is a test description");
		});

		it("should limit length", () => {
			const longDescription = "a".repeat(200);
			const result = sanitizeDescription(longDescription);
			expect(result.length).toBeLessThanOrEqual(160);
		});

		it("should handle empty description", () => {
			const result = sanitizeDescription("");
			expect(result).toBe("");
		});
	});

	describe("generateMetaTags", () => {
		it("should generate basic meta tags", () => {
			const meta = {
				title: "Test Title",
				description: "Test Description",
				url: "https://example.com/test",
			};
			const result = generateMetaTags(meta);

			expect(result).toContain('property="og:title"');
			expect(result).toContain('content="Test Title"');
			expect(result).toContain('property="og:description"');
			expect(result).toContain('content="Test Description"');
		});

		it("should handle optional fields", () => {
			const meta = {
				title: "Test Title",
				description: "Test Description",
				url: "https://example.com/test",
				image: "https://example.com/image.jpg",
			};
			const result = generateMetaTags(meta);

			expect(result).toContain('property="og:image"');
			expect(result).toContain('content="https://example.com/image.jpg"');
		});
	});
});
