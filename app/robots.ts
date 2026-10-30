import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.CF_PAGES_URL ? `https://${process.env.CF_PAGES_URL}` : "https://editalflash.pages.dev");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/termos", "/privacidade", "/seguranca", "/login"],
        disallow: ["/dashboard/", "/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
