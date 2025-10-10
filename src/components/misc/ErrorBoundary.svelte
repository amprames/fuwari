<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

export let fallbackMessage = "Something went wrong. Please try again.";
export let showDetails = false;
export let onError: ((error: Error) => void) | undefined = undefined;

let hasError = false;
let errorMessage = "";
let errorStack = "";

const handleError = (error: Error) => {
	hasError = true;
	errorMessage = error.message;
	errorStack = error.stack || "";

	if (onError) {
		onError(error);
	}

	console.error("Error caught by ErrorBoundary:", error);
};

const retry = () => {
	hasError = false;
	errorMessage = "";
	errorStack = "";
};

onMount(() => {
	const originalConsoleError = console.error;

	// Intercept console.error to catch unhandled errors
	console.error = (...args) => {
		const error = args.find((arg) => arg instanceof Error);
		if (error && !hasError) {
			handleError(error);
		}
		originalConsoleError.apply(console, args);
	};

	// Listen for unhandled promise rejections
	const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
		if (!hasError) {
			const error =
				event.reason instanceof Error
					? event.reason
					: new Error(String(event.reason));
			handleError(error);
		}
	};

	window.addEventListener("unhandledrejection", handleUnhandledRejection);

	return () => {
		console.error = originalConsoleError;
		window.removeEventListener("unhandledrejection", handleUnhandledRejection);
	};
});
</script>

{#if hasError}
  <div class="error-boundary card-base p-6 rounded-[var(--radius-large)] border-2 border-red-200 dark:border-red-800">
    <div class="flex items-center gap-3 mb-4">
      <Icon icon="material-symbols:error-outline" class="text-2xl text-red-500" />
      <h3 class="text-lg font-semibold text-red-700 dark:text-red-300">Error</h3>
    </div>
    
    <p class="text-[var(--normal-text)] mb-4">{fallbackMessage}</p>
    
    {#if showDetails && errorMessage}
      <details class="mb-4">
        <summary class="cursor-pointer text-sm text-[var(--meta-text)] hover:text-[var(--primary)] transition">
          Show error details
        </summary>
        <div class="mt-2 p-3 bg-[var(--inline-code-bg)] rounded-md text-sm font-mono">
          <p class="text-red-600 dark:text-red-400 mb-2">{errorMessage}</p>
          {#if errorStack}
            <pre class="text-xs text-[var(--meta-text)] whitespace-pre-wrap overflow-x-auto">{errorStack}</pre>
          {/if}
        </div>
      </details>
    {/if}
    
    <div class="flex gap-3">
      <button 
        on:click={retry}
        class="btn-regular px-4 py-2 rounded-lg bg-[var(--btn-regular-bg)] hover:bg-[var(--btn-regular-bg-hover)] active:bg-[var(--btn-regular-bg-active)] transition"
      >
        <Icon icon="material-symbols:refresh" class="inline mr-2" />
        Try Again
      </button>
      
      <button 
        on:click={() => window.location.reload()}
        class="btn-plain px-4 py-2 rounded-lg hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition"
      >
        <Icon icon="material-symbols:home" class="inline mr-2" />
        Reload Page
      </button>
    </div>
  </div>
{:else}
  <slot />
{/if}

<style>
  .error-boundary {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>