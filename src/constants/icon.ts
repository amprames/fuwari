import faviconDark32 from "@/assets/images/favicon/favicon-dark-32.png";
import faviconDark128 from "@/assets/images/favicon/favicon-dark-128.png";
import faviconDark180 from "@/assets/images/favicon/favicon-dark-180.png";
import faviconDark192 from "@/assets/images/favicon/favicon-dark-192.png";
// Importar las imágenes de favicon para que Vite las procese
import faviconLight32 from "@/assets/images/favicon/favicon-light-32.png";
import faviconLight128 from "@/assets/images/favicon/favicon-light-128.png";
import faviconLight180 from "@/assets/images/favicon/favicon-light-180.png";
import faviconLight192 from "@/assets/images/favicon/favicon-light-192.png";
import type { Favicon } from "@/types/config.ts";

export const defaultFavicons: Favicon[] = [
	{
		src: faviconLight32,
		theme: "light",
		sizes: "32x32",
	},
	{
		src: faviconLight128,
		theme: "light",
		sizes: "128x128",
	},
	{
		src: faviconLight180,
		theme: "light",
		sizes: "180x180",
	},
	{
		src: faviconLight192,
		theme: "light",
		sizes: "192x192",
	},
	{
		src: faviconDark32,
		theme: "dark",
		sizes: "32x32",
	},
	{
		src: faviconDark128,
		theme: "dark",
		sizes: "128x128",
	},
	{
		src: faviconDark180,
		theme: "dark",
		sizes: "180x180",
	},
	{
		src: faviconDark192,
		theme: "dark",
		sizes: "192x192",
	},
];
