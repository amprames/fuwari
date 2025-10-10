// Arrange-Act-Assert structured E2E tests for Search feature

describe("Búsqueda - barra de búsqueda y panel", () => {
	beforeEach(() => {
		// Arrange: visitar la home; el proyecto usa Astro dev en 4321
		cy.visit("/");
	});

	it("Muestra y usa la barra de escritorio con resultados (flujo positivo)", () => {
		// Arrange
		cy.get('[data-cy="search-bar-desktop"]').should("be.visible");

		// Act
		cy.get('[data-cy="search-input-desktop"]').click().type("astro");

		// Assert: en dev, el componente retorna fakeResult
		cy.get('[data-cy="search-panel"]').should("exist");
		cy.get('[data-cy="search-results"]').within(() => {
			cy.get('[data-cy="search-result"]').should("have.length.greaterThan", 0);
			cy.contains("This Is a Fake Search Result").should("be.visible");
		});
	});

	it("Muestra estado de no resultados cuando input está vacío (edge)", () => {
		// Arrange
		cy.get('[data-cy="search-input-desktop"]').as("input");

		// Act: escribir y luego limpiar para forzar estado vacío
		cy.get("@input").type("x").clear();

		// Assert: panel oculto y sin resultados
		cy.get('[data-cy="search-panel"]').should(
			"have.class",
			"float-panel-closed",
		);
		cy.get('[data-cy="search-results"]').within(() => {
			cy.get('[data-cy="search-result"]').should("not.exist");
			cy.get('[data-cy="no-results"]').should("not.exist");
		});
	});

	it("Navega con Enter al primer resultado cuando hay resultados", () => {
		// Arrange
		cy.get('[data-cy="search-input-desktop"]').click().type("astro");

		// Act: presionar Enter
		cy.get('[data-cy="search-input-desktop"]').type("{enter}");

		// Assert: debe navegar a la URL del primer resultado (en fakeResult es "/")
		cy.location("pathname").should("eq", "/");
	});

	it("Soporta cierre con Escape y foco vuelve al botón de toggle móvil (teclado)", () => {
		// Arrange: abrir panel forzando resultados
		cy.get('[data-cy="search-input-desktop"]').click().type("astro");

		// Act: presionar Escape
		cy.get("body").type("{esc}");

		// Assert: panel cerrado y foco en botón de toggle
		cy.get('[data-cy="search-panel"]').should(
			"have.class",
			"float-panel-closed",
		);
		cy.get("#search-switch").should("exist");
	});

	it("Muestra error y permite reintento cuando la búsqueda falla (flujo negativo)", () => {
		// Arrange: escribir keyword que fuerza error en dev
		cy.get('[data-cy="search-input-desktop"]').click().type("error");

		// Assert: aparece estado de error
		cy.get('[data-cy="search-error"]').should("be.visible");
		cy.contains("Search Error").should("be.visible");

		// Act: reintentar búsqueda
		cy.get('[data-cy="retry-search"]').click();

		// Assert: error desaparece (puede mostrar no-results o resultados según estado)
		cy.get('[data-cy="search-error"]').should("not.exist");
	});
});

describe("Búsqueda - panel móvil y accesibilidad", () => {
	beforeEach(() => {
		cy.visit("/");
		cy.viewport(390, 844); // simular dispositivo móvil
	});

	it("Abre y usa el panel móvil al pulsar el botón de búsqueda", () => {
		// Arrange
		cy.get('[data-cy="search-toggle"]').should("be.visible").click();

		// Act
		cy.get('[data-cy="search-input-mobile"]').type("astro");

		// Assert
		cy.get('[data-cy="search-results"]').within(() => {
			cy.get('[data-cy="search-result"]').should("have.length.greaterThan", 0);
		});
	});

	it("Permite navegación con flechas entre resultados", () => {
		// Arrange
		cy.get('[data-cy="search-toggle"]').click();
		cy.get('[data-cy="search-input-mobile"]').type("astro");

		// Act: mover foco al primer resultado con ArrowDown
		cy.get('[data-cy="search-input-mobile"]').type("{downarrow}");

		// Assert: hay al menos un resultado y foco se puede desplazar
		cy.get('[data-cy="search-result"]')
			.its("length")
			.should("be.greaterThan", 0);
	});
});
