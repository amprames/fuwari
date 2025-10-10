import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

// Types
interface UIState {
	sidebarOpen: boolean;
	searchOpen: boolean;
	isLoading: boolean;
}

interface NavigationState {
	currentPage: string;
	previousPage: string;
}

// Theme store - persisted in localStorage
export const themeStore = persistentAtom<"light" | "dark" | "auto">(
	"theme",
	"auto",
);

// UI state store
export const uiStore = atom<UIState>({
	sidebarOpen: false,
	searchOpen: false,
	isLoading: false,
});

// Navigation state
export const navigationStore = atom<NavigationState>({
	currentPage: "",
	previousPage: "",
});

// Theme utilities
export const toggleTheme = () => {
	const current = themeStore.get();
	const next =
		current === "light" ? "dark" : current === "dark" ? "auto" : "light";
	themeStore.set(next);
};

export const setTheme = (theme: "light" | "dark" | "auto") => {
	themeStore.set(theme);
};

// UI utilities
export const toggleSidebar = () => {
	const current = uiStore.get();
	uiStore.set({ ...current, sidebarOpen: !current.sidebarOpen });
};

export const toggleSearch = () => {
	const current = uiStore.get();
	uiStore.set({ ...current, searchOpen: !current.searchOpen });
};

export const setLoading = (isLoading: boolean) => {
	const current = uiStore.get();
	uiStore.set({ ...current, isLoading });
};

// Navigation utilities
export const setCurrentPage = (page: string) => {
	const current = navigationStore.get();
	navigationStore.set({
		currentPage: page,
		previousPage: current.currentPage,
	});
};
