/**
 * Basic analytics utility for tracking page views and user interactions
 * This is a lightweight implementation that can be extended with external services
 */

interface AnalyticsEvent {
	type: string;
	action: string;
	category?: string;
	label?: string;
	value?: number;
	timestamp: number;
	url: string;
	userAgent: string;
}

interface PageViewEvent {
	url: string;
	title: string;
	timestamp: number;
	referrer?: string;
}

class Analytics {
	private events: AnalyticsEvent[] = [];
	private pageViews: PageViewEvent[] = [];
	private isEnabled: boolean = true;

	constructor() {
		// Initialize analytics
		this.setupEventListeners();
	}

	/**
	 * Track a custom event
	 */
	track(event: Omit<AnalyticsEvent, "timestamp" | "url" | "userAgent">): void {
		if (!this.isEnabled) return;

		const analyticsEvent: AnalyticsEvent = {
			...event,
			timestamp: Date.now(),
			url: window.location.href,
			userAgent: navigator.userAgent,
		};

		this.events.push(analyticsEvent);
		this.logEvent(analyticsEvent);
	}

	/**
	 * Track a page view
	 */
	trackPageView(title?: string): void {
		if (!this.isEnabled) return;

		const pageView: PageViewEvent = {
			url: window.location.href,
			title: title || document.title,
			timestamp: Date.now(),
			referrer: document.referrer,
		};

		this.pageViews.push(pageView);
		this.logPageView(pageView);
	}

	/**
	 * Track user interactions
	 */
	trackClick(element: string, category?: string): void {
		this.track({
			type: "click",
			action: "click",
			category: category || "interaction",
			label: element,
		});
	}

	/**
	 * Track search queries
	 */
	trackSearch(query: string, results?: number): void {
		this.track({
			type: "search",
			action: "search",
			category: "search",
			label: query,
			value: results,
		});
	}

	/**
	 * Track scroll depth
	 */
	trackScroll(depth: number): void {
		this.track({
			type: "scroll",
			action: "scroll",
			category: "engagement",
			label: `${depth}%`,
			value: depth,
		});
	}

	/**
	 * Track time on page
	 */
	trackTimeOnPage(timeInSeconds: number): void {
		this.track({
			type: "timing",
			action: "time_on_page",
			category: "engagement",
			value: timeInSeconds,
		});
	}

	/**
	 * Get analytics data
	 */
	getData(): { events: AnalyticsEvent[]; pageViews: PageViewEvent[] } {
		return {
			events: [...this.events],
			pageViews: [...this.pageViews],
		};
	}

	/**
	 * Clear analytics data
	 */
	clearData(): void {
		this.events = [];
		this.pageViews = [];
	}

	/**
	 * Enable/disable analytics
	 */
	setEnabled(enabled: boolean): void {
		this.isEnabled = enabled;
	}

	/**
	 * Export analytics data as JSON
	 */
	exportData(): string {
		return JSON.stringify(this.getData(), null, 2);
	}

	/**
	 * Setup event listeners for automatic tracking
	 */
	private setupEventListeners(): void {
		// Track page visibility changes
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible") {
				this.track({
					type: "visibility",
					action: "visible",
					category: "engagement",
				});
			}
		});

		// Track scroll depth
		let maxScrollDepth = 0;
		window.addEventListener("scroll", () => {
			const scrollDepth = Math.round(
				(window.scrollY /
					(document.documentElement.scrollHeight - window.innerHeight)) *
					100,
			);

			if (scrollDepth > maxScrollDepth) {
				maxScrollDepth = scrollDepth;
				if (scrollDepth % 25 === 0) {
					// Track at 25%, 50%, 75%, 100%
					this.trackScroll(scrollDepth);
				}
			}
		});

		// Track time on page
		const startTime = Date.now();
		window.addEventListener("beforeunload", () => {
			const timeOnPage = Math.round((Date.now() - startTime) / 1000);
			this.trackTimeOnPage(timeOnPage);
		});
	}

	/**
	 * Log event to console in development
	 */
	private logEvent(event: AnalyticsEvent): void {
		if (import.meta.env.DEV) {
			console.log("Analytics Event:", event);
		}
	}

	/**
	 * Log page view to console in development
	 */
	private logPageView(pageView: PageViewEvent): void {
		if (import.meta.env.DEV) {
			console.log("Analytics Page View:", pageView);
		}
	}
}

// Create singleton instance
export const analytics = new Analytics();

// Export types for external use
export type { AnalyticsEvent, PageViewEvent };
