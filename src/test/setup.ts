import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock IntersectionObserver
global.IntersectionObserver = vi
	.fn()
	.mockImplementation((_callback, options) => ({
		root: options?.root || null,
		rootMargin: options?.rootMargin || "0px",
		thresholds: options?.threshold ? [options.threshold].flat() : [0],
		disconnect: vi.fn(),
		observe: vi.fn(),
		unobserve: vi.fn(),
		takeRecords: vi.fn(() => []),
	}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation((_callback) => ({
	disconnect: vi.fn(),
	observe: vi.fn(),
	unobserve: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};
Object.defineProperty(window, "sessionStorage", {
	value: sessionStorageMock,
});
