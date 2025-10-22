import { beforeEach, describe, expect, it } from "vitest";
import {
	getCategoryUrl,
	getDir,
	getPostUrlBySlug,
	getTagUrl,
	isValidExternalUrl,
	pathsEqual,
	sanitizeExternalUrl,
	url,
} from "./url-utils";

// Helper to control BASE_URL used by url()
const originalImportMeta = import.meta as unknown as {
	env: Record<string, unknown>;
};

describe("url-utils", () => {
	beforeEach(() => {
		originalImportMeta.env.BASE_URL = "/base/";
	});

	it("pathsEqual compara paths ignorando barras y mayúsculas", () => {
		expect(pathsEqual("/Posts/hello/", "posts/HELLO")).toBe(true);
		expect(pathsEqual("/a/b", "/a/b/")).toBe(true);
		expect(pathsEqual("/a/b", "/a/c")).toBe(false);
	});

	it("getPostUrlBySlug genera la URL correcta", () => {
		expect(getPostUrlBySlug("mi-post")).toBe("/base/posts/mi-post/");
	});

	it("getTagUrl gestiona tag vacío y normaliza espacios", () => {
		expect(getTagUrl("")).toBe("/base/archive/");
		expect(getTagUrl("  svelte kit ")).toBe("/base/archive/?tag=svelte%20kit");
	});

	it("getCategoryUrl devuelve uncategorized para valores vacíos o null", () => {
		expect(getCategoryUrl(null)).toBe("/base/archive/?uncategorized=true");
		expect(getCategoryUrl("")).toBe("/base/archive/?uncategorized=true");
	});

	it("getDir extrae el directorio con slash final", () => {
		expect(getDir("/a/b/c.txt")).toBe("/a/b/");
		expect(getDir("file.txt")).toBe("/");
	});

	it("url une BASE_URL con el path", () => {
		expect(url("/x/y")).toBe("/base/x/y");
		// duplicidad de barras se limpia
		originalImportMeta.env.BASE_URL = "/root//";
		expect(url("//x//y")).toBe("/root/x/y");
	});

	it("isValidExternalUrl valida esquemas permitidos y rechaza peligrosos", () => {
		expect(isValidExternalUrl("https://example.com")).toBe(true);
		expect(isValidExternalUrl("http://example.com")).toBe(true);
		expect(isValidExternalUrl("mailto:test@example.com")).toBe(true);
		expect(isValidExternalUrl("tel:+34123123")).toBe(true);
		expect(isValidExternalUrl("   example.com  ")).toBe(true); // dominio sin esquema

		expect(isValidExternalUrl("")).toBe(false);
		expect(isValidExternalUrl("javascript:alert(1)")).toBe(false);
		expect(isValidExternalUrl("data:text/html,hi")).toBe(false);
		expect(isValidExternalUrl("file:///etc/passwd")).toBe(false);
		expect(isValidExternalUrl("   bad url  ")).toBe(false);
	});

	it("sanitizeExternalUrl añade https a dominios y limpia inválidos", () => {
		expect(sanitizeExternalUrl("example.com")).toBe("https://example.com");
		expect(sanitizeExternalUrl(" https://ok.com ")).toBe("https://ok.com");
		expect(sanitizeExternalUrl("mailto:a@b.com")).toBe("mailto:a@b.com");
		expect(sanitizeExternalUrl("javascript:alert(1)")).toBe("");
	});
});
