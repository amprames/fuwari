<script lang="ts">
<script lang="ts">

import { onDestroy, onMount } from "svelte";

let progress = 0;
let isVisible = false;
let articleElement: HTMLElement | null = null;

onMount(() => {
	// Find the main article content
	articleElement =
		document.querySelector("article") || document.querySelector("main");

	if (!articleElement) return;

	const updateProgress = () => {
		const articleTop = articleElement!.offsetTop;
		const articleHeight = articleElement!.offsetHeight;
		const windowHeight = window.innerHeight;
		const scrollTop = window.scrollY;

		// Calculate progress percentage
		const scrolled = scrollTop - articleTop + windowHeight;
		const total = articleHeight + windowHeight;
		progress = Math.min(Math.max((scrolled / total) * 100, 0), 100);

		// Show/hide progress bar based on scroll position
		isVisible = scrollTop > articleTop - 100;
	};

	// Initial calculation
	updateProgress();

	// Listen for scroll events
	window.addEventListener("scroll", updateProgress, { passive: true });

	// Cleanup
	onDestroy(() => {
		window.removeEventListener("scroll", updateProgress);
	});
});
</script>

{
	#if
	isVisible;
}
<div class="reading-progress fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
		<div 
			class="reading-progress-bar h-full bg-blue-500 transition-all duration-150 ease-out"
			style="width: {progress}%"
		></div>
	</div>
{/if}

<style>
.reading-progress
{
	background: var(--card-bg);
	border - bottom;
	: 1px solid
	var(--border-color);
}

.reading-progress-bar
{
	background: var(--primary);
	box - shadow;
	: 0 0 10px
	var(--primary-alpha);
}
</style>
</script>

{#if isVisible}
	<div class="reading-progress fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
		<div 
			class="reading-progress-bar h-full bg-blue-500 transition-all duration-150 ease-out"
			style="width: {progress}%"
		></div>
	</div>
{/if}

<style>
	.reading-progress {
		background: var(--card-bg);
		border-bottom: 1px solid var(--border-color);
	}
	
	.reading-progress-bar {
		background: var(--primary);
		box-shadow: 0 0 10px var(--primary-alpha);
	}
</style>
