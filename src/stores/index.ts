// Theme and UI stores

// Content stores
export {
	allCategories,
	allTags,
	currentPostStore,
	filteredPosts,
	postsStore,
	resetSearch,
	searchStore,
	setCurrentPost,
	setPosts,
	updateSearch,
} from "./content";
export {
	navigationStore,
	setCurrentPage,
	setLoading,
	setTheme,
	themeStore,
	toggleSearch,
	toggleSidebar,
	toggleTheme,
	uiStore,
} from "./theme";

// Store types
export type ThemeType = "light" | "dark" | "auto";
export type SortBy = "date" | "title";
export type SortOrder = "asc" | "desc";
