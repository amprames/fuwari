# Naming Conventions

This document establishes clear naming conventions for the Fuwari project to ensure consistency and maintainability.

## File Naming

### Components
- **Astro Components**: Use PascalCase
  - ✅ `PostCard.astro`
  - ✅ `Navbar.astro`
  - ✅ `WidgetLayout.astro`

- **Svelte Components**: Use PascalCase
  - ✅ `Search.svelte`
  - ✅ `LightDarkSwitch.svelte`
  - ✅ `DisplaySettings.svelte`

### TypeScript/JavaScript Files
- **Utility Files**: Use kebab-case with descriptive suffixes
  - ✅ `content-utils.ts`
  - ✅ `url-utils.ts`
  - ✅ `validation-utils.ts`
  - ✅ `date-utils.ts`

- **Configuration Files**: Use kebab-case or single words
  - ✅ `config.ts`
  - ✅ `constants.ts`
  - ✅ `link-presets.ts`

- **Store Files**: Use single descriptive words
  - ✅ `content.ts`
  - ✅ `theme.ts`
  - ✅ `index.ts`

### Pages
- **Astro Pages**: Use kebab-case for multi-word pages
  - ✅ `archive.astro`
  - ✅ `about.astro`
  - ✅ `404.astro`

### Directories
- **All Directories**: Use kebab-case or single words
  - ✅ `components/`
  - ✅ `utils/`
  - ✅ `constants/`
  - ✅ `expressive-code/`

## Code Naming

### Variables and Functions
- **Variables**: Use camelCase
  ```typescript
  const currentPost = getCurrentPost();
  const isLoading = false;
  ```

- **Functions**: Use camelCase with descriptive verbs
  ```typescript
  function getSortedPosts() { }
  function validateAndSanitize() { }
  function updateSearch() { }
  ```

### Constants
- **Global Constants**: Use UPPER_SNAKE_CASE
  ```typescript
  const MAX_POSTS_PER_PAGE = 10;
  const DEFAULT_THEME_COLOR = 250;
  ```

- **Enum Values**: Use UPPER_SNAKE_CASE
  ```typescript
  enum LinkPreset {
    HOME = 0,
    ARCHIVE = 1,
    ABOUT = 2,
  }
  ```

### Types and Interfaces
- **Types**: Use PascalCase
  ```typescript
  type SiteConfig = { };
  type BlogPostData = { };
  ```

- **Interfaces**: Use PascalCase with descriptive names
  ```typescript
  interface NavBarConfig { }
  interface ProfileConfig { }
  ```

### CSS Classes
- **Utility Classes**: Follow Tailwind CSS conventions
- **Custom Classes**: Use kebab-case
  ```css
  .post-card { }
  .navigation-menu { }
  .search-panel { }
  ```

## Best Practices

1. **Be Descriptive**: Names should clearly indicate purpose
   - ✅ `getSortedPostsList()`
   - ❌ `getList()`

2. **Use Consistent Prefixes**: Group related functions
   - ✅ `getPostUrl()`, `getTagUrl()`, `getCategoryUrl()`
   - ✅ `validateUrl()`, `validateString()`, `validateHtml()`

3. **Avoid Abbreviations**: Use full words when possible
   - ✅ `navigation`
   - ❌ `nav` (except in well-known cases like `navbar`)

4. **Boolean Variables**: Use is/has/can/should prefixes
   - ✅ `isLoading`, `hasError`, `canEdit`, `shouldShow`

5. **Event Handlers**: Use handle/on prefixes
   - ✅ `handleClick()`, `onSubmit()`, `handleSearch()`

## File Organization

- Group related files in appropriate directories
- Use index files to re-export from directories
- Keep file names short but descriptive
- Avoid deep nesting (max 3 levels recommended)

## Migration Notes

The current codebase already follows most of these conventions. Any future files should adhere to these standards, and existing files should be gradually updated during maintenance.