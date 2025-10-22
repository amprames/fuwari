# 🧩 Component Documentation

This document provides detailed information about the components used in the Fuwari blog template.

## 📋 Table of Contents

- [Layout Components](#layout-components)
- [UI Components](#ui-components)
- [Widget Components](#widget-components)
- [SEO Components](#seo-components)
- [Utility Components](#utility-components)

## 🏗️ Layout Components

### Layout.astro
Main layout component that wraps all pages.

**Props:**
- `title?: string` - Page title
- `banner?: string` - Banner image path
- `description?: string` - Page description
- `lang?: string` - Page language
- `setOGTypeArticle?: boolean` - Set Open Graph type to article
- `image?: string` - Social media image
- `publishedTime?: string` - Article publish date
- `modifiedTime?: string` - Article last modified date
- `tags?: string[]` - Article tags
- `author?: string` - Article author

**Features:**
- Theme management (light/dark mode)
- Font preloading
- SEO meta tags
- Responsive design
- Banner support

### MainGridLayout.astro
Grid layout for main content areas.

**Props:**
- `class?: string` - Additional CSS classes

**Features:**
- Responsive grid system
- Sidebar integration
- Content area management

## 🎨 UI Components

### Navbar.astro
Main navigation component.

**Props:**
- `class?: string` - Additional CSS classes

**Features:**
- Responsive navigation
- Mobile menu
- Search integration
- Theme toggle
- Display settings

### Search.svelte
Search functionality component.

**Features:**
- Real-time search
- Keyboard navigation
- Search history
- Error handling
- Loading states

### LightDarkSwitch.svelte
Theme toggle component.

**Features:**
- Light/dark/auto modes
- Persistent settings
- Smooth transitions
- Accessibility support

### PostCard.astro
Blog post card component.

**Props:**
- `post` - Post data object
- `class?: string` - Additional CSS classes

**Features:**
- Post metadata display
- Tag rendering
- Reading time
- Responsive design

### PostMeta.astro
Post metadata display component.

**Props:**
- `post` - Post data object
- `class?: string` - Additional CSS classes

**Features:**
- Publication date
- Reading time
- Tags and categories
- Author information

## 🧩 Widget Components

### Profile.astro
Author profile widget.

**Features:**
- Avatar display
- Social links
- Bio information
- Responsive design

### DisplaySettings.svelte
Display settings panel.

**Features:**
- Theme selection
- Font size adjustment
- Layout preferences
- Persistent settings

### NavMenuPanel.astro
Mobile navigation menu.

**Props:**
- `links` - Navigation links array

**Features:**
- Responsive design
- Keyboard navigation
- External link indicators

## 🔍 SEO Components

### StructuredData.astro
Structured data for SEO.

**Props:**
- `type?: string` - Schema type (default: "website")
- `title?: string` - Page title
- `description?: string` - Page description
- `url?: string` - Page URL
- `image?: string` - Page image

**Features:**
- JSON-LD structured data
- Open Graph support
- Twitter Cards
- Schema.org compliance

## 🛠️ Utility Components

### ImageWrapper.astro
Optimized image component.

**Props:**
- `id?: string` - Element ID
- `src: string` - Image source
- `class?: string` - CSS classes
- `alt?: string` - Alt text
- `position?: string` - Object position
- `basePath?: string` - Base path for local images
- `loading?: "lazy" | "eager"` - Loading strategy

**Features:**
- Lazy loading
- Image optimization
- Responsive images
- Error handling

### ErrorBoundary.svelte
Error boundary component.

**Props:**
- `fallbackMessage?: string` - Error message
- `showDetails?: boolean` - Show error details
- `onError?: (error: Error) => void` - Error handler

**Features:**
- Error catching
- User-friendly messages
- Retry functionality
- Development debugging

### BackToTop.astro
Back to top button.

**Features:**
- Smooth scrolling
- Visibility toggle
- Keyboard navigation
- Accessibility support

## 📝 Usage Examples

### Basic Layout Usage

```astro
---
import Layout from '@/layouts/Layout.astro';
---

<Layout title="My Page" description="Page description">
  <h1>My Content</h1>
</Layout>
```

### Component with Props

```astro
---
import PostCard from '@/components/PostCard.astro';
---

<PostCard post={postData} class="custom-class" />
```

### Svelte Component Usage

```svelte
<script>
  import Search from '@/components/Search.svelte';
</script>

<Search />
```

## 🎯 Best Practices

1. **Props Validation**: Always define TypeScript interfaces for props
2. **Accessibility**: Include ARIA labels and keyboard navigation
3. **Performance**: Use lazy loading for heavy components
4. **Responsive Design**: Test on multiple screen sizes
5. **Error Handling**: Implement proper error boundaries
6. **Documentation**: Document complex props and usage

## 🔧 Customization

### Adding New Components

1. Create component file in appropriate directory
2. Define TypeScript interfaces for props
3. Implement accessibility features
4. Add tests for functionality
5. Update this documentation

### Styling Components

- Use Tailwind CSS classes
- Follow design system patterns
- Implement dark mode support
- Ensure responsive behavior

### Testing Components

- Write unit tests for logic
- Test accessibility features
- Verify responsive behavior
- Test error scenarios
