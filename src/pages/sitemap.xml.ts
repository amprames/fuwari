import { getSortedPosts } from "@utils/content-utils";
import { getPostUrlBySlug } from "@utils/url-utils";
import type { APIRoute } from "astro";
import { siteConfig } from "@/config";

export const GET: APIRoute = async ({ site }) => {
	const posts = await getSortedPosts();

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  
  <!-- Homepage -->
  <url>
    <loc>${site}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- About page -->
  <url>
    <loc>${new URL("/about/", site)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Archive page -->
  <url>
    <loc>${new URL("/archive/", site)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Blog posts -->
  ${posts
		.map((post) => {
			const postUrl = new URL(getPostUrlBySlug(post.slug), site);
			const lastmod = post.data.updated || post.data.published;

			return `
  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastmod.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    ${
			post.data.image
				? `
    <image:image>
      <image:loc>${new URL(post.data.image, site)}</image:loc>
      <image:title>${post.data.title}</image:title>
      <image:caption>${post.data.description || post.data.title}</image:caption>
    </image:image>`
				: ""
		}
    ${
			post.data.published
				? `
    <news:news>
      <news:publication>
        <news:name>${siteConfig.title}</news:name>
        <news:language>${siteConfig.lang.replace("_", "-")}</news:language>
      </news:publication>
      <news:publication_date>${post.data.published.toISOString()}</news:publication_date>
      <news:title>${post.data.title}</news:title>
      <news:keywords>${post.data.tags?.join(", ") || ""}</news:keywords>
    </news:news>`
				: ""
		}
  </url>`;
		})
		.join("")}
    
  <!-- Category pages -->
  ${Array.from(
		new Set(
			posts
				.map((post) => post.data.category)
				.filter((category): category is string => Boolean(category)),
		),
	)
		.map(
			(category) => `
  <url>
    <loc>${new URL(`/archive/?category=${encodeURIComponent(category)}`, site)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`,
		)
		.join("")}
    
  <!-- Tag pages -->
  ${Array.from(
		new Set(
			posts
				.flatMap((post) => post.data.tags || [])
				.filter((tag): tag is string => Boolean(tag)),
		),
	)
		.map(
			(tag) => `
  <url>
    <loc>${new URL(`/archive/?tag=${encodeURIComponent(tag)}`, site)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`,
		)
		.join("")}
    
</urlset>`;

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
