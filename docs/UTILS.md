# 🛠️ Utilities Documentation

This document provides detailed information about the utility functions and their usage in the Fuwari blog template.

## 📋 Table of Contents

- [Content Utils](#content-utils)
- [Date Utils](#date-utils)
- [SEO Utils](#seo-utils)
- [URL Utils](#url-utils)
- [Validation Utils](#validation-utils)
- [Setting Utils](#setting-utils)
- [Logger](#logger)

## 📄 Content Utils

### `content-utils.ts`

Functions for managing blog content and posts.

#### `getSortedPosts()`
Returns all blog posts sorted by publication date.

```typescript
const posts = await getSortedPosts();
```

#### `getPostBySlug(slug: string)`
Retrieves a specific post by its slug.

```typescript
const post = await getPostBySlug('my-post-slug');
```

#### `getAllTags()`
Returns all unique tags from posts.

```typescript
const tags = await getAllTags();
```

#### `getAllCategories()`
Returns all unique categories from posts.

```typescript
const categories = await getAllCategories();
```

## 📅 Date Utils

### `date-utils.ts`

Functions for date formatting and manipulation.

#### `formatDate(date: string | Date, locale?: string)`
Formats a date according to locale preferences.

```typescript
const formatted = formatDate('2024-01-15', 'en-US');
// Returns: "January 15, 2024"
```

#### `getRelativeTime(date: string | Date)`
Returns human-readable relative time.

```typescript
const relative = getRelativeTime('2024-01-15');
// Returns: "2 days ago"
```

## 🔍 SEO Utils

### `seo-utils.ts`

Functions for SEO optimization and meta tag generation.

#### `generateCanonicalUrl(baseUrl: string, path: string)`
Generates canonical URLs for SEO.

```typescript
const canonical = generateCanonicalUrl('https://example.com', '/blog/post');
// Returns: "https://example.com/blog/post"
```

#### `sanitizeDescription(description: string)`
Sanitizes and truncates meta descriptions.

```typescript
const sanitized = sanitizeDescription('<p>HTML description</p>');
// Returns: "HTML description" (max 160 chars)
```

#### `generateMetaTags(meta: MetaTags)`
Generates Open Graph and Twitter Card meta tags.

```typescript
const metaTags = generateMetaTags({
  title: 'My Post',
  description: 'Post description',
  url: 'https://example.com/post',
  image: 'https://example.com/image.jpg'
});
```

## 🔗 URL Utils

### `url-utils.ts`

Functions for URL manipulation and validation.

#### `url(path: string)`
Joins base URL with path, handling slashes correctly.

```typescript
const fullUrl = url('/blog/post');
// Returns: "/base/blog/post" (with base URL)
```

#### `pathsEqual(path1: string, path2: string)`
Compares two URL paths for equality.

```typescript
const isEqual = pathsEqual('/blog/post/', '/blog/post');
// Returns: true
```

#### `isValidExternalUrl(url: string)`
Validates external URLs for security.

```typescript
const isValid = isValidExternalUrl('https://example.com');
// Returns: true
```

#### `sanitizeExternalUrl(url: string)`
Sanitizes external URLs to prevent XSS.

```typescript
const sanitized = sanitizeExternalUrl('https://example.com');
// Returns: sanitized URL
```

## ✅ Validation Utils

### `validation-utils.ts`

Zod schemas and validation functions for data integrity.

#### Schemas Available

- `urlSchema` - URL validation
- `safeStringSchema` - Safe string validation
- `htmlIdSchema` - HTML ID validation
- `cssClassSchema` - CSS class validation
- `postMetaPropsSchema` - Post metadata validation

#### `validateAndSanitize<T>(schema: ZodSchema<T>, data: unknown)`
Validates and sanitizes data using Zod schemas.

```typescript
const result = validateAndSanitize(urlSchema, userInput);
// Returns: validated and sanitized data
```

#### `safeValidate<T>(schema: ZodSchema<T>, data: unknown)`
Safely validates data without throwing errors.

```typescript
const result = safeValidate(urlSchema, userInput);
// Returns: { success: boolean, data?: T, error?: string }
```

## ⚙️ Setting Utils

### `setting-utils.ts`

Functions for managing user settings and preferences.

#### `getStoredTheme()`
Retrieves stored theme preference.

```typescript
const theme = getStoredTheme();
// Returns: 'light' | 'dark' | 'auto'
```

#### `setTheme(theme: string)`
Sets and stores theme preference.

```typescript
setTheme('dark');
```

#### `getHue()`
Retrieves stored color hue preference.

```typescript
const hue = getHue();
// Returns: number (0-360)
```

#### `setHue(hue: number)`
Sets and stores color hue preference.

```typescript
setHue(250);
```

## 📝 Logger

### `logger.ts`

Development logging utility.

#### `logDev(...args: unknown[])`
Logs messages only in development mode.

```typescript
logDev('Debug message', { data: 'value' });
// Only logs in development environment
```

## 🧪 Testing Utilities

### Test Helpers

#### Mock Functions
- `createMockPost()` - Creates mock post data for testing
- `createMockConfig()` - Creates mock configuration for testing

#### Test Utilities
- `simulateProd()` - Simulates production environment
- `resetStores()` - Resets all Svelte stores

## 📊 Performance Utilities

### Bundle Analysis
- `analyzeBundle()` - Analyzes bundle size and composition
- `getChunkInfo()` - Returns information about code chunks

### Optimization Helpers
- `optimizeImages()` - Optimizes image assets
- `preloadCriticalResources()` - Preloads critical resources

## 🔧 Custom Utilities

### Creating New Utilities

1. **Create the utility file** in `src/utils/`
2. **Define TypeScript interfaces** for parameters and return types
3. **Add JSDoc comments** for documentation
4. **Write unit tests** in `*.test.ts` file
5. **Export functions** for use in components

### Example Utility

```typescript
// src/utils/my-utility.ts
/**
 * Formats a string with custom options
 * @param input - The input string to format
 * @param options - Formatting options
 * @returns Formatted string
 */
export function formatString(
  input: string, 
  options: { uppercase?: boolean; trim?: boolean } = {}
): string {
  let result = input;
  
  if (options.trim) {
    result = result.trim();
  }
  
  if (options.uppercase) {
    result = result.toUpperCase();
  }
  
  return result;
}
```

## 🎯 Best Practices

1. **Type Safety**: Always use TypeScript for utility functions
2. **Error Handling**: Implement proper error handling and validation
3. **Performance**: Consider performance implications of utility functions
4. **Testing**: Write comprehensive tests for all utilities
5. **Documentation**: Document complex logic and edge cases
6. **Reusability**: Design utilities to be reusable across components
7. **Validation**: Use Zod schemas for data validation
8. **Security**: Sanitize user inputs to prevent XSS attacks

## 🔍 Debugging Utilities

### Development Helpers
- `debugStore()` - Debug Svelte store values
- `logPerformance()` - Log performance metrics
- `traceFunction()` - Trace function execution

### Production Monitoring
- `trackErrors()` - Track and report errors
- `monitorPerformance()` - Monitor performance metrics
- `collectAnalytics()` - Collect usage analytics
