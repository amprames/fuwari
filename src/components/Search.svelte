<script lang="ts">
import I18nKey from "@i18n/i18n-keys";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import type { SearchResult } from "@/global";
import ErrorBoundary from "./misc/ErrorBoundary.svelte";

let keywordDesktop = "";
let keywordMobile = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;
let searchError = false;
let errorMessage = "";

const fakeResult: SearchResult[] = [
	{
		url: url("/"),
		meta: {
			title: "This Is a Fake Search Result",
		},
		excerpt:
			"Because the search cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: url("/"),
		meta: {
			title: "If You Want to Test the Search",
		},
		excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
	},
];

const togglePanel = () => {
	const panel = document.getElementById("search-panel");
	panel?.classList.toggle("float-panel-closed");
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById("search-panel");
	if (!panel || !isDesktop) return;

	if (show) {
		panel.classList.remove("float-panel-closed");
	} else {
		panel.classList.add("float-panel-closed");
	}
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	if (!keyword) {
		setPanelVisibility(false, isDesktop);
		result = [];
		searchError = false;
		return;
	}

	if (!initialized) {
		return;
	}

	isSearching = true;
	searchError = false;

	try {
		let searchResults: SearchResult[] = [];

		if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(keyword);
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else if (import.meta.env.DEV) {
			// Simulate potential error in development
			if (keyword.toLowerCase().includes("error")) {
				throw new Error("Simulated search error for testing");
			}
			searchResults = fakeResult;
		} else {
			searchResults = [];
			throw new Error("Pagefind is not available in production environment.");
		}

		result = searchResults;
		setPanelVisibility(result.length > 0, isDesktop);
	} catch (error) {
		console.error("Search error:", error);
		searchError = true;
		errorMessage =
			error instanceof Error
				? error.message
				: "An unexpected error occurred during search";
		result = [];
		setPanelVisibility(true, isDesktop); // Keep panel open to show error
	} finally {
		isSearching = false;
	}
};

const handleKeydown = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement;

	// Handle Escape key to close search panel
	if (event.key === "Escape") {
		setPanelVisibility(false, true);
		setPanelVisibility(false, false);
		const searchButton = document.getElementById("search-switch");
		if (searchButton) {
			searchButton.focus();
		}
		return;
	}

	// Handle Enter key in search input
	if (event.key === "Enter" && target.tagName === "INPUT") {
		event.preventDefault();
		if (result.length > 0) {
			// Navigate to first result
			const firstResult = result[0];
			window.location.href = firstResult.url;
		}
		return;
	}

	// Handle arrow navigation in search results
	if (
		(event.key === "ArrowDown" || event.key === "ArrowUp") &&
		result.length > 0
	) {
		event.preventDefault();
		const resultLinks = document.querySelectorAll(
			"#search-panel .search-result-link",
		);
		const currentIndex = Array.from(resultLinks).indexOf(
			document.activeElement as Element,
		);

		let nextIndex: number;
		if (event.key === "ArrowDown") {
			if (target.tagName === "INPUT") {
				nextIndex = 0; // Move from input to first result
			} else {
				nextIndex =
					currentIndex < resultLinks.length - 1 ? currentIndex + 1 : 0;
			}
		} else {
			// ArrowUp
			if (currentIndex <= 0) {
				// Move back to search input
				const searchInput = document.querySelector(
					"#search-panel input",
				) as HTMLElement;
				if (searchInput) {
					searchInput.focus();
				}
				return;
			} else {
				nextIndex = currentIndex - 1;
			}
		}

		if (resultLinks[nextIndex]) {
			(resultLinks[nextIndex] as HTMLElement).focus();
		}
	}
};

onMount(() => {
	const initializeSearch = () => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";
		console.log("Pagefind status on init:", pagefindLoaded);
		if (keywordDesktop) search(keywordDesktop, true);
		if (keywordMobile) search(keywordMobile, false);
	};

	if (import.meta.env.DEV) {
		console.log(
			"Pagefind is not available in development mode. Using mock data.",
		);
		initializeSearch();
	} else {
		document.addEventListener("pagefindready", () => {
			console.log("Pagefind ready event received.");
			initializeSearch();
		});
		document.addEventListener("pagefindloaderror", () => {
			console.warn(
				"Pagefind load error event received. Search functionality will be limited.",
			);
			initializeSearch(); // Initialize with pagefindLoaded as false
		});

		// Fallback in case events are not caught or pagefind is already loaded by the time this script runs
		setTimeout(() => {
			if (!initialized) {
				console.log("Fallback: Initializing search after timeout.");
				initializeSearch();
			}
		}, 2000); // Adjust timeout as needed
	}
});

$: if (initialized && keywordDesktop) {
	(async () => {
		await search(keywordDesktop, true);
	})();
}

$: if (initialized && keywordMobile) {
	(async () => {
		await search(keywordMobile, false);
	})();
}
</script>

<!-- search bar for desktop view -->
<div 
    id="search-bar" 
    data-cy="search-bar-desktop"
    role="search"
    class="hidden lg:flex transition-all items-center h-11 mr-2 rounded-lg
          bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
          dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10"
>
    <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30" aria-hidden="true"></Icon>
    <input 
        placeholder="{i18n(I18nKey.search)}" 
        bind:value={keywordDesktop} 
        on:focus={() => search(keywordDesktop, true)}
        on:keydown={handleKeydown}
        aria-label="Search posts"
        aria-describedby="search-results"
        class="transition-all pl-10 text-sm bg-transparent outline-0
               h-full w-40 active:w-60 focus:w-60 text-black/50 dark:text-white/50"
        data-cy="search-input-desktop"
    >
</div>

<!-- toggle btn for phone/tablet view -->
<button 
    on:click={togglePanel} 
    aria-label="Toggle search panel" 
    aria-expanded="false"
    aria-controls="search-panel"
    id="search-switch"
    class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90"
    data-cy="search-toggle"
>
    <Icon icon="material-symbols:search" class="text-[1.25rem]" aria-hidden="true"></Icon>
</button>

<!-- search panel -->
<div 
    id="search-panel" 
    role="dialog"
    aria-label="Search panel"
    aria-live="polite"
    class="float-panel float-panel-closed search-panel absolute md:w-[30rem]
           top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2"
    data-cy="search-panel"
>

    <!-- search bar inside panel for phone/tablet -->
    <div 
        id="search-bar-inside" 
        role="search"
        class="flex relative lg:hidden transition-all items-center h-11 rounded-xl
              bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
              dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10"
        data-cy="search-bar-mobile"
    >
        <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30" aria-hidden="true"></Icon>
        <input 
            placeholder="Search" 
            bind:value={keywordMobile}
            on:keydown={handleKeydown}
            aria-label="Search posts"
            aria-describedby="search-results"
            class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
                   focus:w-60 text-black/50 dark:text-white/50"
            data-cy="search-input-mobile"
        >
    </div>

    <!-- search results -->
    <div id="search-results" role="region" aria-label="Search results" data-cy="search-results">
        {#if isSearching}
            <!-- Loading state -->
            <div class="flex items-center justify-center py-8" data-cy="search-loading">
                <div class="flex items-center gap-3">
                    <div class="inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent w-5 h-5 text-[var(--primary)]" role="status" aria-label="Searching">
                        <span class="sr-only">Searching...</span>
                    </div>
                    <span class="text-sm text-[var(--meta-text)]">Searching...</span>
                </div>
            </div>
            <!-- Search skeleton -->
            <div class="space-y-3 mt-2">
                {#each Array(3) as _}
                    <div class="animate-pulse p-3 rounded-xl">
                        <div class="h-5 bg-[var(--skeleton-bg)] rounded w-3/4 mb-2"></div>
                        <div class="space-y-2">
                            <div class="h-4 bg-[var(--skeleton-bg)] rounded w-full"></div>
                            <div class="h-4 bg-[var(--skeleton-bg)] rounded w-5/6"></div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else if searchError}
            <!-- Error state -->
            <div class="p-4 mt-2" data-cy="search-error">
                <div class="flex items-center gap-3 mb-3">
                    <Icon icon="material-symbols:error-outline" class="text-xl text-red-500" />
                    <h4 class="font-semibold text-red-700 dark:text-red-300">Search Error</h4>
                </div>
                <p class="text-sm text-[var(--meta-text)] mb-3">{errorMessage}</p>
                <button 
                    on:click={() => { searchError = false; search(keywordDesktop || keywordMobile, true); }}
                    class="text-sm px-3 py-1 rounded bg-[var(--btn-regular-bg)] hover:bg-[var(--btn-regular-bg-hover)] transition flex items-center gap-2"
                    data-cy="retry-search"
                >
                    <Icon icon="material-symbols:refresh" class="text-sm" />
                    Try Again
                </button>
            </div>
        {:else if result.length === 0 && (keywordDesktop || keywordMobile)}
            <!-- No results state -->
            <div class="p-4 mt-2 text-center" data-cy="no-results">
                <Icon icon="material-symbols:search-off" class="text-3xl text-[var(--meta-text)] opacity-50 mb-2" />
                <p class="text-sm text-[var(--meta-text)]">No results found for "{keywordDesktop || keywordMobile}"</p>
            </div>
        {:else}
            {#each result as item}
                <a 
                    href={item.url}
                    aria-label="Go to {item.meta.title}"
                    class="search-result-link transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
                           rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] focus:bg-[var(--btn-plain-bg-hover)] focus:outline-2 focus:outline-[var(--primary)]"
                    data-cy="search-result"
                >
                    <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                        {item.meta.title}<Icon icon="fa6-solid:chevron-right" class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]" aria-hidden="true"></Icon>
                    </div>
                    <div class="transition text-sm text-50">
                        {@html item.excerpt}
                    </div>
                </a>
            {/each}
        {/if}
    </div>
</div>

<style>
  input:focus {
    outline: 0;
  }
  .search-panel {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
