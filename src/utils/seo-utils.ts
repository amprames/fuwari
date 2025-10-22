import type { APIContext } from "astro";

type MetaRobots = {
	noindex?: boolean;
	nofollow?: boolean;
	noarchive?: boolean;
	nosnippet?: boolean;
	noimageindex?: boolean;
	notranslate?: boolean;
	maxSnippet?: number;
	maxImagePreview?: "none" | "standard" | "large";
	maxVideoPreview?: number;
};

export function generateCanonicalUrl(path: string, site: string | URL): string {
	const url = new URL(path, site);
	// Ensure consistent trailing slashes
	if (!url.pathname.endsWith("/")) {
		url.pathname = `${url.pathname}/`;
	}
	return url.toString();
}

export function generateRobotsContent(meta: MetaRobots = {}): string {
	const directives: string[] = [];

	if (meta.noindex) directives.push("noindex");
	if (meta.nofollow) directives.push("nofollow");
	if (meta.noarchive) directives.push("noarchive");
	if (meta.nosnippet) directives.push("nosnippet");
	if (meta.noimageindex) directives.push("noimageindex");
	if (meta.notranslate) directives.push("notranslate");
	if (meta.maxSnippet) directives.push(`max-snippet:${meta.maxSnippet}`);
	if (meta.maxImagePreview) {
		directives.push(`max-image-preview:${meta.maxImagePreview}`);
	}
	if (meta.maxVideoPreview) {
		directives.push(`max-video-preview:${meta.maxVideoPreview}`);
	}

	return directives.length > 0 ? directives.join(", ") : "index, follow";
}

export function getPageMetadata(context: APIContext, isDraft: boolean = false) {
	const url = new URL(context.url);
	const canonicalUrl = generateCanonicalUrl(url.pathname, context.site || "");

	const robots = generateRobotsContent({
		noindex: isDraft,
		nofollow: isDraft,
		noarchive: isDraft,
	});

	return {
		canonicalUrl,
		robots,
	};
}
