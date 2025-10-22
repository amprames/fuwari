import * as AstroContent from "astro:content";
import I18nKey from "@i18n/i18n-keys";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as Mod from "./content-utils";

// El alias en vitest.config.ts resuelve "astro:content" a un mock.
// Aquí simplemente aseguramos que sea una función mockeable.

// Mock i18n
vi.mock("@i18n/translation", () => ({
	i18n: (key: unknown) =>
		key === I18nKey.uncategorized
			? "Uncategorized"
			: typeof key === "string"
				? key
				: String(key),
}));

// Mock getCategoryUrl to deterministic output
vi.mock("@utils/url-utils.ts", () => ({
	getCategoryUrl: (c: string) => `URL:${c}`,
}));

// Tipos: evitar import dinámico en tipos (rompe esbuild)
type Post = {
	id: string;
	slug: string;
	body: string;
	collection: string;
	data: {
		title: string;
		description: string;
		published: string;
		updated: string;
		draft?: boolean;
		tags: string[];
		category: string | null;
		[k: string]: unknown;
	};
};
// No importamos "astro:content" aquí; usamos la referencia del mock `getCollection`

function makePost(
	slug: string,
	title: string,
	date: string,
	extra?: Partial<Post["data"]>,
) {
	return {
		id: slug,
		slug,
		body: "BODY",
		collection: "posts",
		data: {
			title,
			description: "desc",
			published: date,
			updated: date,
			draft: false,
			tags: [],
			category: "",
			...extra,
		},
	} as Post;
}

type GetCollectionSpy = {
	mockImplementation: (
		impl: (
			name: string,
			filter?: (x: { data: Post["data"] }) => boolean,
		) => Promise<Post[]>,
	) => unknown;
	mockResolvedValueOnce: (value: unknown) => unknown;
};

let getCollectionSpy: GetCollectionSpy;
let simulateProd = false;
const importMeta = import.meta as unknown as { env: Record<string, unknown> };

describe("content-utils", () => {
	const posts = [
		makePost("a", "Alpha", "2024-01-10", { tags: ["svelte"], category: "web" }),
		makePost("b", "Beta", "2024-02-01", {
			tags: ["astro", "svelte"],
			category: "ssg",
		}),
		makePost("c", "Gamma", "2023-12-31", {
			tags: ["astro"],
			category: "web",
			draft: true,
		}),
	];

	beforeEach(() => {
		vi.clearAllMocks();
		// Default: not PROD
		importMeta.env.PROD = false;
		getCollectionSpy = (
			vi.spyOn as unknown as (target: unknown, property: unknown) => unknown
		)(
			AstroContent as unknown as Record<string, unknown>,
			"getCollection",
		) as unknown as GetCollectionSpy;
		simulateProd = false;
		getCollectionSpy.mockImplementation(
			async (
				_name: string,
				filter?: (x: { data: Post["data"] }) => boolean,
			) => {
				if (simulateProd) {
					return posts.filter((p) => p.data.draft !== true);
				}
				return filter ? posts.filter((p) => filter({ data: p.data })) : posts;
			},
		);
	});

	it("getSortedPosts ordena desc por fecha y asigna next/prev", async () => {
		const list = await Mod.getSortedPosts();
		expect(list.map((p) => p.slug)).toEqual(["b", "a", "c"]);
		// navegación
		const a = list[1];
		expect(a.data.nextSlug).toBe("b");
		expect(a.data.prevSlug).toBe("c");
	});

	it("getSortedPostsList devuelve lista ligera sin body y ordenada", async () => {
		const list = await Mod.getSortedPostsList();
		expect(list.map((p) => p.slug)).toEqual(["b", "a", "c"]);
		// body no existe en tipo reducido
		const first = list[0] as unknown as { body?: unknown };
		expect(first.body).toBeUndefined();
	});

	it("getTagList cuenta y ordena tags alfabéticamente", async () => {
		const tagList = await Mod.getTagList();
		expect(tagList).toEqual([
			{ name: "astro", count: 2 },
			{ name: "svelte", count: 2 },
		]);
	});

	it("getCategoryList cuenta categorías y genera URLs", async () => {
		const catList = await Mod.getCategoryList();
		expect(catList).toEqual([
			{ name: "ssg", count: 1, url: "URL:ssg" },
			{ name: "web", count: 2, url: "URL:web" },
		]);
	});

	it("filtra drafts en PROD", async () => {
		(import.meta as { env: { PROD: boolean } }).env.PROD = true;
		simulateProd = true;
		const list = await Mod.getSortedPosts();
		// c era draft -> fuera
		expect(list.map((p) => p.slug)).toEqual(["b", "a"]);
	});

	it("categoría null se mapea a Uncategorized y cuenta correctamente", async () => {
		const localPosts = [
			makePost("x", "X", "2024-01-01", { category: null as unknown as string }),
		];
		getCollectionSpy.mockResolvedValueOnce(localPosts);
		const cats = await Mod.getCategoryList();
		expect(cats).toEqual([
			{ name: "Uncategorized", count: 1, url: "URL:Uncategorized" },
		]);
	});
});
