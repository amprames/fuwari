// Ejecutar solo este test:
// npm run test -- --run src/i18n/translation.test.ts

// Ejecutar solo este test con coverage:
// npm run test:coverage -- --run src/i18n/translation.test.ts

import { describe, expect, it, vi } from "vitest";
import I18nKey from "./i18n-keys";
import { getTranslation, i18n } from "./translation";

vi.mock("../config", () => ({ siteConfig: { lang: "es" } }));

describe("i18n translation", () => {
	it("getTranslation devuelve el mapa de un idioma conocido y por defecto en desconocidos", () => {
		const es = getTranslation("es");
		expect(es[I18nKey.home]).toBeTruthy();
		const def = getTranslation("xx");
		expect(def[I18nKey.home]).toBeTruthy();
	});

	it("i18n usa siteConfig.lang para resolver traducciones", () => {
		expect(i18n(I18nKey.home)).toBeTruthy();
	});
});
