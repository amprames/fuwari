import type { CollectionEntry } from "astro:content";
import { atom, computed } from "nanostores";

// Types
interface SearchState {
	query: string;
	tags: string[];
	category: string;
	sortBy: "date" | "title";
	sortOrder: "asc" | "desc";
}

// Content store
export const postsStore = atom<CollectionEntry<"posts">[]>([]);
export const currentPostStore = atom<CollectionEntry<"posts"> | null>(null);

// Search and filter state
export const searchStore = atom<SearchState>({
	query: "",
	tags: [],
	category: "",
	sortBy: "date",
	sortOrder: "desc",
});

// Computed stores
export const filteredPosts = computed(
	[postsStore, searchStore],
	(posts, search) => {
		let filtered = [...posts];

		// Filter by search query
		if (search.query) {
			const query = search.query.toLowerCase();
			filtered = filtered.filter(
				(post) =>
					post.data.title.toLowerCase().includes(query) ||
					post.data.description?.toLowerCase().includes(query) ||
					post.data.tags?.some((tag) => tag.toLowerCase().includes(query)),
			);
		}

		// Filter by tags
		if (search.tags.length > 0) {
			filtered = filtered.filter((post) =>
				search.tags.every((tag) => post.data.tags?.includes(tag)),
			);
		}

		// Filter by category
		if (search.category) {
			filtered = filtered.filter(
				(post) => post.data.category === search.category,
			);
		}

		// Sort posts
		filtered.sort((a, b) => {
			let comparison = 0;

			switch (search.sortBy) {
				case "title":
					comparison = a.data.title.localeCompare(b.data.title);
					break;
				case "date":
				default:
					comparison =
						new Date(a.data.published).getTime() -
						new Date(b.data.published).getTime();
					break;
			}

			return search.sortOrder === "desc" ? -comparison : comparison;
		});

		return filtered;
	},
);

export const allTags = computed(postsStore, (posts) => {
	const tags = new Set<string>();
	posts.forEach((post) => {
		post.data.tags?.forEach((tag) => {
			tags.add(tag);
		});
	});
	return Array.from(tags).sort();
});

export const allCategories = computed(postsStore, (posts) => {
	const categories = new Set<string>();
	posts.forEach((post) => {
		if (post.data.category) {
			categories.add(post.data.category);
		}
	});
	return Array.from(categories).sort();
});

// Content utilities

/**
 * Updates the posts store with a new array of posts
 * @param posts - Array of blog posts from Astro content collection
 */
export const setPosts = (posts: CollectionEntry<"posts">[]) => {
	postsStore.set(posts);
};

/**
 * Sets the currently active post in the store
 * @param post - The current post or null to clear
 */
export const setCurrentPost = (post: CollectionEntry<"posts"> | null) => {
	currentPostStore.set(post);
};

/**
 * Updates search parameters with partial updates
 * @param updates - Partial search state to merge with current state
 */
export const updateSearch = (updates: Partial<typeof searchStore.value>) => {
	const current = searchStore.get();
	searchStore.set({ ...current, ...updates });
};

/**
 * Resets all search parameters to their default values
 */
export const resetSearch = () => {
	searchStore.set({
		query: "",
		tags: [],
		category: "",
		sortBy: "date",
		sortOrder: "desc",
	});
};
