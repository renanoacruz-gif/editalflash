import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://editalflash.com.br";

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
