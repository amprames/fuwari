import { describe, it, expect, beforeEach } from "vitest";
import type { CollectionEntry } from "astro:content";
import {
  postsStore,
  currentPostStore,
  searchStore,
  filteredPosts,
  allTags,
  allCategories,
  setPosts,
  setCurrentPost,
  updateSearch,
  resetSearch,
} from "./content";

function post(
  slug: string,
  title: string,
  published: string,
  opts?: Partial<CollectionEntry<"posts">["data"]>
): CollectionEntry<"posts"> {
  return {
    id: slug,
    slug,
    body: "",
    collection: "posts",
    data: {
      title,
      description: opts?.description ?? "",
      published,
      updated: published,
      draft: false,
      tags: opts?.tags ?? [],
      category: opts?.category ?? "",
      ...opts,
    } as any,
  } as any;
}

describe("content stores", () => {
  const base = [
    post("a", "Alpha", "2024-01-10", { tags: ["svelte"], category: "web" }),
    post("b", "Beta", "2024-02-01", { tags: ["astro", "svelte"], category: "ssg" }),
    post("c", "Gamma", "2023-12-31", { tags: ["astro"], category: "web" }),
  ];

  beforeEach(() => {
    setPosts(base);
    setCurrentPost(null);
    resetSearch();
  });

  it("setPosts y filteredPosts ordenan por fecha desc por defecto", () => {
    const list = filteredPosts.get();
    expect(list.map((p) => p.slug)).toEqual(["b", "a", "c"]);
  });

  it("updateSearch filtra por query en título, descripción o tags", () => {
    updateSearch({ query: "astro" });
    expect(filteredPosts.get().map((p) => p.slug)).toEqual(["b", "c"]);
  });

  it("filtra por tags (AND) y categoría", () => {
    updateSearch({ tags: ["svelte"], category: "web" });
    expect(filteredPosts.get().map((p) => p.slug)).toEqual(["a"]);
  });

  it("permite ordenar por título asc y desc", () => {
    updateSearch({ sortBy: "title", sortOrder: "asc" });
    expect(filteredPosts.get().map((p) => p.slug)).toEqual(["a", "b", "c"]);
    updateSearch({ sortBy: "title", sortOrder: "desc" });
    expect(filteredPosts.get().map((p) => p.slug)).toEqual(["c", "b", "a"]);
  });

  it("allTags y allCategories se derivan correctamente", () => {
    expect(allTags.get()).toEqual(["astro", "svelte"]);
    expect(allCategories.get()).toEqual(["ssg", "web"]);
  });

  it("setCurrentPost establece y limpia el post actual", () => {
    setCurrentPost(base[0]);
    expect(currentPostStore.get()?.slug).toBe("a");
    setCurrentPost(null);
    expect(currentPostStore.get()).toBeNull();
  });

  it("resetSearch restablece filtros por defecto", () => {
    updateSearch({ query: "x", tags: ["astro"], category: "web", sortBy: "title", sortOrder: "asc" });
    resetSearch();
    expect(searchStore.get()).toEqual({ query: "", tags: [], category: "", sortBy: "date", sortOrder: "desc" });
  });
});




