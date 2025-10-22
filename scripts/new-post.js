/* This is a script to create a new post markdown file with front-matter */

import fs from "node:fs";
import path from "node:path";

function getISODate() {
	return new Date().toISOString();
}

function slugify(text) {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "")
		.replace(/--+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}

function checkSlugCollision(directory, slug) {
	const files = fs.readdirSync(directory);
	return files.some((file) => {
		const fileSlug = path.basename(file, path.extname(file));
		return fileSlug === slug;
	});
}

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error(`Error: No title provided
Usage: npm run new-post -- "Your Post Title Here"`);
	process.exit(1);
}

const title = args[0].trim();
const slug = slugify(title);
const targetDir = "./src/content/posts/";

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
	fs.mkdirSync(targetDir, { recursive: true });
}

// Check for slug collisions
if (checkSlugCollision(targetDir, slug)) {
	console.error(`Error: A post with the slug "${slug}" already exists`);
	process.exit(1);
}

const fileName = `${slug}.md`;
const fullPath = path.join(targetDir, fileName);

const frontmatter = `---
title: "${title}"
published: "${getISODate()}"
description: ""
image: ""
tags: []
category: ""
draft: true
lang: ""
---
`;

try {
	fs.writeFileSync(fullPath, frontmatter);
	console.log(`✅ Created new post: ${fullPath}`);
	console.log(
		`📝 Edit the file to add your content and set draft: false when ready to publish.`,
	);
} catch (error) {
	console.error(`❌ Error creating post: ${error.message}`);
	process.exit(1);
}
