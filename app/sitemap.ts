import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.CF_PAGES_URL ? `https://${process.env.CF_PAGES_URL}` : "https://editalflash.pages.dev");

  const lastModified = new Date();

  // Apenas as páginas institucionais e públicas são expostas
  const publicRoutes = [
    "",
    "/pricing",
    "/termos",
    "/privacidade",
    "/seguranca",
    "/login",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/pricing" ? 0.9 : 0.6,
  }));
}
