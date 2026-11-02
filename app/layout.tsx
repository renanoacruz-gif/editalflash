import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[var(--paper)] text-[var(--ink)] antialiased selection:bg-[var(--flash-lt)]/30 selection:text-[var(--ink)] font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
