import I18nKey from "@i18n/i18n-keys";
import { i18n } from "@i18n/translation";

/**
 * Compares two URL paths for equality, ignoring leading/trailing slashes and case
 * @param path1 - First path to compare
 * @param path2 - Second path to compare
 * @returns true if paths are equal, false otherwise
 */
export function pathsEqual(path1: string, path2: string) {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

/**
 * Joins URL parts together, removing duplicate slashes
 * @param parts - URL parts to join
 * @returns Joined URL string
 */
function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

/**
 * Generates a URL for a blog post by its slug
 * @param slug - The post slug
 * @returns Complete URL for the post
 */
export function getPostUrlBySlug(slug: string): string {
	return url(`/posts/${slug}/`);
}

/**
 * Generates a URL for filtering posts by tag
 * @param tag - The tag to filter by
 * @returns URL for the tag archive page
 */
export function getTagUrl(tag: string): string {
	if (!tag) return url("/archive/");
	return url(`/archive/?tag=${encodeURIComponent(tag.trim())}`);
}

/**
 * Generates a URL for filtering posts by category
 * @param category - The category to filter by (can be null)
 * @returns URL for the category archive page
 */
export function getCategoryUrl(category: string | null): string {
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === i18n(I18nKey.uncategorized).toLowerCase()
	)
		return url("/archive/?uncategorized=true");
	return url(`/archive/?category=${encodeURIComponent(category.trim())}`);
}

/**
 * Extracts the directory path from a file path
 * @param path - The file path
 * @returns Directory path with trailing slash
 */
export function getDir(path: string): string {
	const lastSlashIndex = path.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return path.substring(0, lastSlashIndex + 1);
}

/**
 * Creates a complete URL by joining the base URL with the given path
 * @param path - The path to append to the base URL
 * @returns Complete URL string
 */
export function url(path: string) {
	return joinUrl("", import.meta.env.BASE_URL, path);
}

/**
 * Validates if a URL is safe for external links
 * Prevents XSS attacks and malicious redirects
 * @param url - The URL to validate
 * @returns boolean - true if the URL is safe, false otherwise
 */
export function isValidExternalUrl(url: string): boolean {
	if (!url || typeof url !== "string") {
		return false;
	}

	// Remove whitespace and convert to lowercase for validation
	const trimmedUrl = url.trim().toLowerCase();

	// Check for empty or invalid URLs
	if (trimmedUrl === "" || trimmedUrl.length > 2048) {
		return false;
	}

	// Prevent javascript: and data: schemes which can be used for XSS
	const dangerousSchemes = [
		"javascript:",
		"data:",
		"vbscript:",
		"file:",
		"about:",
		"chrome:",
		"chrome-extension:",
		"moz-extension:",
	];

	if (dangerousSchemes.some((scheme) => trimmedUrl.startsWith(scheme))) {
		return false;
	}

	// Allow only http, https, mailto, and tel schemes
	const allowedSchemes = ["http://", "https://", "mailto:", "tel:"];
	const hasValidScheme = allowedSchemes.some((scheme) =>
		trimmedUrl.startsWith(scheme),
	);

	// If no scheme is provided, assume https (common for social media links)
	if (!hasValidScheme && !trimmedUrl.includes("://")) {
		// Check if it looks like a domain (contains a dot and no spaces)
		if (trimmedUrl.includes(".") && !trimmedUrl.includes(" ")) {
			return true; // Will be prefixed with https:// when used
		}
		return false;
	}

	return hasValidScheme;
}

/**
 * Sanitizes a URL for safe external linking
 * @param url - The URL to sanitize
 * @returns string - The sanitized URL or empty string if invalid
 */
export function sanitizeExternalUrl(url: string): string {
	if (!isValidExternalUrl(url)) {
		return "";
	}

	const trimmedUrl = url.trim();

	// Add https:// prefix if no scheme is provided
	if (
		!trimmedUrl.includes("://") &&
		!trimmedUrl.startsWith("mailto:") &&
		!trimmedUrl.startsWith("tel:")
	) {
		return `https://${trimmedUrl}`;
	}

	return trimmedUrl;
}
