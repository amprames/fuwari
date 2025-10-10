import { z } from "zod";

/**
 * Validation schemas for component props and user input
 * Prevents XSS attacks and ensures data integrity
 */

// URL validation schema
export const urlSchema = z
	.string()
	.trim()
	.min(1, "URL cannot be empty")
	.max(2048, "URL too long")
	.refine((url) => {
		// Allow relative URLs, mailto, tel, and http/https
		const allowedPatterns = [
			/^\/[^/]/, // Relative URLs starting with /
			/^\.\.?\//, // Relative URLs starting with ./ or ../
			/^https?:\/\//, // HTTP/HTTPS URLs
			/^mailto:/, // Email links
			/^tel:/, // Phone links
			/^#/, // Hash links
		];

		// Block dangerous schemes
		const dangerousSchemes = [
			"javascript:",
			"data:",
			"vbscript:",
			"file:",
			"about:",
		];

		const lowerUrl = url.toLowerCase();

		// Check for dangerous schemes
		if (dangerousSchemes.some((scheme) => lowerUrl.startsWith(scheme))) {
			return false;
		}

		// Check if URL matches allowed patterns
		return allowedPatterns.some((pattern) => pattern.test(url));
	}, "Invalid or potentially unsafe URL")
	.optional();

// Safe string schema for general text content
export const safeStringSchema = z
	.string()
	.trim()
	.max(1000, "Text too long")
	.refine((str) => {
		// Block script tags and dangerous HTML
		const dangerousPatterns = [
			/<script[^>]*>/i,
			/<\/script>/i,
			/javascript:/i,
			/on\w+\s*=/i, // Event handlers like onclick=
			/<iframe[^>]*>/i,
			/<object[^>]*>/i,
			/<embed[^>]*>/i,
		];

		return !dangerousPatterns.some((pattern) => pattern.test(str));
	}, "Content contains potentially unsafe elements")
	.optional();

// ID schema for HTML elements
export const htmlIdSchema = z
	.string()
	.trim()
	.min(1, "ID cannot be empty")
	.max(100, "ID too long")
	.regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, "Invalid HTML ID format")
	.optional();

// CSS class schema
export const cssClassSchema = z
	.string()
	.trim()
	.max(500, "CSS classes too long")
	.refine((classes) => {
		// Basic validation for CSS class names
		if (!classes) return true;

		const classNames = classes.split(/\s+/);
		return classNames.every(
			(className) =>
				/^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(className) ||
				/^[a-zA-Z_-][a-zA-Z0-9_-]*:\[[^\]]+\]$/.test(className), // Tailwind arbitrary values
		);
	}, "Invalid CSS class names")
	.optional();

// Style attribute schema
export const cssStyleSchema = z
	.string()
	.trim()
	.max(1000, "Style attribute too long")
	.refine((style) => {
		if (!style) return true;

		// Block dangerous CSS properties and values
		const dangerousPatterns = [
			/expression\s*\(/i,
			/javascript:/i,
			/behavior\s*:/i,
			/-moz-binding/i,
			/url\s*\(\s*["']?javascript:/i,
		];

		return !dangerousPatterns.some((pattern) => pattern.test(style));
	}, "Style contains potentially unsafe CSS")
	.optional();

// Tag name schema for blog tags
export const tagSchema = z
	.string()
	.trim()
	.min(1, "Tag cannot be empty")
	.max(50, "Tag too long")
	.regex(/^[a-zA-Z0-9\s\-_]+$/, "Tag contains invalid characters");

// Array of tags schema
export const tagsArraySchema = z
	.array(tagSchema)
	.max(20, "Too many tags")
	.optional();

// Category schema
export const categorySchema = z
	.string()
	.trim()
	.min(1, "Category cannot be empty")
	.max(100, "Category too long")
	.regex(/^[a-zA-Z0-9\s\-_]+$/, "Category contains invalid characters")
	.optional();

// Badge text schema
export const badgeSchema = z
	.string()
	.trim()
	.max(20, "Badge text too long")
	.optional();

// ARIA label schema
export const ariaLabelSchema = z
	.string()
	.trim()
	.min(1, "ARIA label cannot be empty")
	.max(200, "ARIA label too long")
	.optional();

/**
 * Component-specific validation schemas
 */

// ButtonTag component props
export const buttonTagPropsSchema = z.object({
	size: safeStringSchema,
	dot: z.boolean().optional(),
	href: urlSchema,
	label: ariaLabelSchema,
});

// ButtonLink component props
export const buttonLinkPropsSchema = z.object({
	badge: badgeSchema,
	url: urlSchema,
	label: ariaLabelSchema,
});

// WidgetLayout component props
export const widgetLayoutPropsSchema = z.object({
	id: htmlIdSchema.refine((id) => id !== undefined, "Widget ID is required"),
	name: safeStringSchema,
	isCollapsed: z.boolean().optional(),
	collapsedHeight: safeStringSchema,
	class: cssClassSchema,
	style: cssStyleSchema,
});

// PostMeta component props
export const postMetaPropsSchema = z.object({
	class: cssClassSchema.refine(
		(cls) => cls !== undefined,
		"CSS class is required",
	),
	published: z.date(),
	updated: z.date().optional(),
	tags: tagsArraySchema.refine(
		(tags) => tags !== undefined,
		"Tags array is required",
	),
	category: categorySchema,
	hideTagsForMobile: z.boolean().optional(),
	hideUpdateDate: z.boolean().optional(),
});

/**
 * Validation helper functions
 */

/**
 * Validates and sanitizes data using a Zod schema, throwing an error if validation fails
 * @template T - The expected type after validation
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns T - The validated and sanitized data
 * @throws Error - If validation fails with detailed error messages
 */
export function validateAndSanitize<T>(
	schema: z.ZodSchema<T>,
	data: unknown,
): T {
	try {
		return schema.parse(data);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errorMessages = error.issues.map(
				(err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`,
			);
			throw new Error(`Validation failed: ${errorMessages.join(", ")}`);
		}
		throw error;
	}
}

/**
 * Safely validates data using a Zod schema, returning a result object instead of throwing
 * @template T - The expected type after validation
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns Object with success flag, data (if successful), and error message (if failed)
 */
export function safeValidate<T>(
	schema: z.ZodSchema<T>,
	data: unknown,
): {
	success: boolean;
	data?: T;
	error?: string;
} {
	try {
		const result = schema.parse(data);
		return { success: true, data: result };
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errorMessages = error.issues.map(
				(err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`,
			);
			return { success: false, error: errorMessages.join(", ") };
		}
		return { success: false, error: "Unknown validation error" };
	}
}

/**
 * Sanitizes HTML content by removing dangerous elements and attributes
 * @param content - The HTML content to sanitize
 * @returns string - The sanitized HTML content
 */
export function sanitizeHtmlContent(content: string): string {
	if (!content) return "";

	// Remove script tags and their content
	let sanitized = content.replace(/<script[^>]*>.*?<\/script>/gis, "");

	// Remove dangerous attributes
	sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
	sanitized = sanitized.replace(/\s+javascript:\s*[^"'\s>]*/gi, "");

	// Remove dangerous tags
	const dangerousTags = [
		"iframe",
		"object",
		"embed",
		"form",
		"input",
		"textarea",
		"button",
	];
	dangerousTags.forEach((tag) => {
		const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, "gis");
		sanitized = sanitized.replace(regex, "");
	});

	return sanitized.trim();
}
