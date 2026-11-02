import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const rawBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.CF_PAGES_URL ? `https://${process.env.CF_PAGES_URL}` : "https://editalflash.pages.dev");

const appBaseUrl = rawBaseUrl.replace(/^https?:\/\/(https?:\/\/)?/i, "https://");

export const metadata: Metadata = {
  title: "EditalFlash | Auditoria Preventiva de Habilitação (Lei 14.133/21)",
  description:
    "Auditoria técnica preventiva de certidões, balanço patrimonial e atestados operacionais com prova literal de página e linha do edital.",
  metadataBase: new URL(appBaseUrl),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-light.svg" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#FAFAFA] text-[#09090B] antialiased selection:bg-[#18181B] selection:text-white font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
