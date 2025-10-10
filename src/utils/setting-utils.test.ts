import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import * as settingUtils from "./setting-utils";

// Arrange helpers
function createConfigCarrier(hue?: string) {
	const carrier = document.createElement("div");
	carrier.id = "config-carrier";
	if (hue !== undefined) carrier.dataset.hue = hue;
	document.body.appendChild(carrier);
	return carrier;
}

describe("setting-utils", () => {
	beforeEach(() => {
		// Clean DOM
		document.body.innerHTML = "";
		document.documentElement.className = "";
		document.documentElement.removeAttribute("data-theme");

		// Reset localStorage mocks
		window.localStorage.getItem = vi.fn();
		window.localStorage.setItem = vi.fn();
		window.localStorage.removeItem = vi.fn();
		window.localStorage.clear = vi.fn();

		// Reset matchMedia default
		(window.matchMedia as unknown as Mock).mockImplementation(
			(query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			}),
		);
	});

	describe("getDefaultHue", () => {
		it("devuelve el hue del dataset cuando existe (caso positivo)", () => {
			// Arrange
			createConfigCarrier("200");
			// Act
			const result = settingUtils.getDefaultHue();
			// Assert
			expect(result).toBe(200);
		});

		it("usa el fallback 250 cuando no existe el elemento o el hue (caso negativo)", () => {
			// Arrange: no carrier
			// Act
			const result = settingUtils.getDefaultHue();
			// Assert
			expect(result).toBe(250);
		});

		it("retorna NaN si el dataset.hue no es numérico (edge)", () => {
			// Arrange
			createConfigCarrier("abc");
			// Act
			const result = settingUtils.getDefaultHue();
			// Assert
			expect(Number.isNaN(result)).toBe(true);
		});
	});

	describe("getHue", () => {
		it("retorna el valor guardado en localStorage cuando existe (caso positivo)", () => {
			// Arrange
			(window.localStorage.getItem as Mock).mockReturnValue("180");
			// Act
			const result = settingUtils.getHue();
			// Assert
			expect(result).toBe(180);
		});

		it("retorna el valor por defecto cuando no hay hue en localStorage (caso negativo)", () => {
			// Arrange
			(window.localStorage.getItem as Mock).mockReturnValue(null);
			createConfigCarrier("210");
			// Act
			const result = settingUtils.getHue();
			// Assert
			expect(result).toBe(210);
		});

		it("retorna NaN si el valor guardado no es numérico (edge)", () => {
			// Arrange
			(window.localStorage.getItem as Mock).mockReturnValue("xyz");
			// Act
			const result = settingUtils.getHue();
			// Assert
			expect(Number.isNaN(result)).toBe(true);
		});
	});

	describe("setHue", () => {
		it("guarda en localStorage y actualiza la variable CSS --hue (caso positivo)", () => {
			// Arrange
			const root = document.documentElement as HTMLElement;
			const spySetProperty = vi.spyOn(root.style, "setProperty");
			// Act
			settingUtils.setHue(345);
			// Assert
			expect(window.localStorage.setItem).toHaveBeenCalledWith("hue", "345");
			expect(spySetProperty).toHaveBeenCalledWith("--hue", "345");
		});

		it("no lanza error si :root no existe (caso negativo)", () => {
			// Arrange
			const originalQuery = document.querySelector;
			document.querySelector = vi
				.fn()
				.mockReturnValue(null) as unknown as typeof document.querySelector;
			// Act
			settingUtils.setHue(100);
			// Assert
			expect(window.localStorage.setItem).toHaveBeenCalledWith("hue", "100");
			// Restore
			document.querySelector = originalQuery;
		});
	});

	describe("applyThemeToDocument", () => {
		it("remueve la clase dark en modo light y setea data-theme", () => {
			// Arrange
			document.documentElement.classList.add("dark");
			// Act
			settingUtils.applyThemeToDocument(LIGHT_MODE);
			// Assert
			expect(document.documentElement.classList.contains("dark")).toBe(false);
			expect(document.documentElement.getAttribute("data-theme")).toBe(
				"github-dark",
			);
		});

		it("agrega la clase dark en modo dark y setea data-theme", () => {
			// Arrange
			document.documentElement.classList.remove("dark");
			// Act
			settingUtils.applyThemeToDocument(DARK_MODE);
			// Assert
			expect(document.documentElement.classList.contains("dark")).toBe(true);
			expect(document.documentElement.getAttribute("data-theme")).toBe(
				"github-dark",
			);
		});

		it("AUTO_MODE agrega dark si matchMedia.matches es true", () => {
			// Arrange
			(window.matchMedia as unknown as Mock).mockImplementation(
				(q: string) => ({
					matches: true,
					media: q,
					onchange: null,
					addListener: vi.fn(),
					removeListener: vi.fn(),
					addEventListener: vi.fn(),
					removeEventListener: vi.fn(),
					dispatchEvent: vi.fn(),
				}),
			);
			// Act
			settingUtils.applyThemeToDocument(AUTO_MODE);
			// Assert
			expect(document.documentElement.classList.contains("dark")).toBe(true);
			expect(document.documentElement.getAttribute("data-theme")).toBe(
				"github-dark",
			);
		});

		it("AUTO_MODE remueve dark si matchMedia.matches es false", () => {
			// Arrange (default mock es false)
			// Act
			settingUtils.applyThemeToDocument(AUTO_MODE);
			// Assert
			expect(document.documentElement.classList.contains("dark")).toBe(false);
			expect(document.documentElement.getAttribute("data-theme")).toBe(
				"github-dark",
			);
		});
	});

	describe("setTheme", () => {
		it("guarda el tema y aplica el efecto en el documento", () => {
			// Act
			settingUtils.setTheme(DARK_MODE);
			// Assert
			expect(window.localStorage.setItem).toHaveBeenCalledWith(
				"theme",
				DARK_MODE,
			);
			// Verifica efecto indirecto de applyThemeToDocument
			expect(document.documentElement.classList.contains("dark")).toBe(true);
			expect(document.documentElement.getAttribute("data-theme")).toBe(
				"github-dark",
			);
		});
	});

	describe("getStoredTheme", () => {
		it("retorna el tema almacenado en localStorage cuando existe", () => {
			// Arrange
			(window.localStorage.getItem as Mock).mockReturnValue(LIGHT_MODE);
			// Act
			const result = settingUtils.getStoredTheme();
			// Assert
			expect(result).toBe(LIGHT_MODE);
		});

		it("retorna DEFAULT_THEME cuando no hay tema guardado", () => {
			// Arrange
			(window.localStorage.getItem as Mock).mockReturnValue(null);
			// Act
			const result = settingUtils.getStoredTheme();
			// Assert
			expect(result).toBe(DEFAULT_THEME);
		});
	});
});
