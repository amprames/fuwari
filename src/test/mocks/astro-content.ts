// Mock mínimo de astro:content para tests
export const getCollection: (
	name: string,
	filter?: (x: { data: Record<string, unknown> }) => boolean,
) => Promise<unknown[]> = async (_name, _filter) => {
	return [];
};
