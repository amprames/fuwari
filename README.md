# 🍥Fuwari  
A static blog template built with [Astro](https://astro.build).

[**🖥️ Live Demo (Vercel)**](https://fuwari.vercel.app)
[![Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen)](https://github.com/amprames/fuwari/actions)

![Preview Image](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)

🌏 README in
[**Español**](https://github.com/saicaca/fuwari/blob/main/docs/README.es.md) /

## ✨ Features

- [x] Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- [x] Smooth animations and page transitions
- [x] Light / dark mode
- [x] Customizable theme colors & banner
- [x] Responsive design
- [x] Search functionality with [Pagefind](https://pagefind.app/)
- [x] [Markdown extended features](https://github.com/saicaca/fuwari?tab=readme-ov-file#-markdown-extended-syntax)
- [x] Table of contents
- [x] RSS feed

## 🚀 Getting Started

1. Create your blog repository:
    - [Generate a new repository](https://github.com/saicaca/fuwari/generate) from this template or fork this repository.
    - Or run one of the following commands:
       ```sh
       npm create fuwari@latest
       yarn create fuwari
       pnpm create fuwari@latest
       bun create fuwari@latest
       deno run -A npm:create-fuwari@latest
       ```
2. To edit your blog locally, clone your repository, run `pnpm install` to install dependencies.
    - Install [pnpm](https://pnpm.io) `npm install -g pnpm` if you haven't.
3. Edit the config file `src/config.ts` to customize your blog.
4. Run `pnpm new-post <filename>` to create a new post and edit it in `src/content/posts/`.
5. Deploy your blog to Vercel, Netlify, GitHub Pages, etc. following [the guides](https://docs.astro.build/en/guides/deploy/). You need to edit the site configuration in `astro.config.mjs` before deployment.

## 📝 Frontmatter of Posts

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp      # Set only if the post's language differs from the site's language in `config.ts`
---
```

## 🧩 Markdown Extended Syntax

In addition to Astro's default support for [GitHub Flavored Markdown](https://github.github.com/gfm/), several extra Markdown features are included:

- Admonitions ([Preview and Usage](https://fuwari.vercel.app/posts/markdown-extended/#admonitions))
- GitHub repository cards ([Preview and Usage](https://fuwari.vercel.app/posts/markdown-extended/#github-repository-cards))
- Enhanced code blocks with Expressive Code ([Preview](https://fuwari.vercel.app/posts/expressive-code/) / [Docs](https://expressive-code.com/))

## 🧪 Testing

### Unit Tests with Vitest
Run unit tests with the following commands:

```bash
# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once
pnpm test:run

# Generate test coverage report
pnpm test:coverage
```

### End-to-End Testing with Cypress
Run E2E tests with the following commands:

```bash
# Run E2E tests in headless mode
pnpm test:e2e

# Open Cypress Test Runner
pnpm test:e2e:open

# Run E2E tests in headed mode
pnpm test:e2e:headed

# Generate E2E test coverage report
pnpm test:e2e:coverage
```

## 🔍 Bundle Analysis

To analyze your bundle size and optimize it, you can use the `ANALYZE` environment variable:

```bash
# Run with bundle analysis
ANALYZE=true pnpm build
```

This will generate an interactive visualization of your bundle that you can view in the browser.

## 📝 Code Style & Conventions

This project follows consistent coding standards and naming conventions. Please refer to the following documents:

- [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) - Guidelines for file, variable, and component naming
- [.biome.json](./.biome.json) - Code formatting and linting rules

## ⚡ Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                              |
|:---------------------------|:----------------------------------------------------|
| `pnpm install`             | Installs dependencies                               |
| `pnpm dev`                 | Starts local dev server at `localhost:4321`         |
| `pnpm build`               | Build your production site to `./dist/`             |
| `pnpm preview`             | Preview your build locally, before deploying        |
| `pnpm check`               | Run checks for errors in your code                  |
| `pnpm format`              | Format your code using Biome                        |
| `pnpm lint`                | Lint your code using Biome                          |
| `pnpm test`                | Run unit tests with Vitest                          |
| `pnpm test:e2e`            | Run E2E tests with Cypress                         |
| `pnpm new-post <filename>` | Create a new post                                   |
| `pnpm astro ...`           | Run CLI commands like `astro add`, `astro check`    |
| `pnpm astro --help`        | Get help using the Astro CLI                        |

## 📝 Creating a New Post

To create a new blog post, run:

```bash
pnpm new-post "My Awesome Post Title"
# or
npm run new-post -- "My Awesome Post Title"
```

