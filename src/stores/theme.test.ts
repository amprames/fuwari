import { beforeEach, describe, expect, it } from "vitest";
import {
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

describe("theme store y utilidades UI", () => {
	beforeEach(() => {
		themeStore.set("auto");
		uiStore.set({ sidebarOpen: false, searchOpen: false, isLoading: false });
		navigationStore.set({ currentPage: "", previousPage: "" });
	});

	it("toggleTheme rota entre light -> dark -> auto -> light", () => {
		setTheme("light");
		toggleTheme();
		expect(themeStore.get()).toBe("dark");
		toggleTheme();
		expect(themeStore.get()).toBe("auto");
		toggleTheme();
		expect(themeStore.get()).toBe("light");
	});

	it("setTheme establece el tema directamente", () => {
		setTheme("dark");
		expect(themeStore.get()).toBe("dark");
	});

	it("toggleSidebar y toggleSearch alternan correctamente", () => {
		toggleSidebar();
		expect(uiStore.get().sidebarOpen).toBe(true);
		toggleSidebar();
		expect(uiStore.get().sidebarOpen).toBe(false);

		toggleSearch();
		expect(uiStore.get().searchOpen).toBe(true);
		toggleSearch();
		expect(uiStore.get().searchOpen).toBe(false);
	});

	it("setLoading actualiza el estado de carga", () => {
		setLoading(true);
		expect(uiStore.get().isLoading).toBe(true);
		setLoading(false);
		expect(uiStore.get().isLoading).toBe(false);
	});

	it("setCurrentPage mueve current a previous y asigna el nuevo current", () => {
		setCurrentPage("/primera");
		expect(navigationStore.get()).toEqual({
			currentPage: "/primera",
			previousPage: "",
		});
		setCurrentPage("/segunda");
		expect(navigationStore.get()).toEqual({
			currentPage: "/segunda",
			previousPage: "/primera",
		});
	});
});
