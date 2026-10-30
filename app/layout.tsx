import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CustomCursor } from "@/components/CustomCursor";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

const rawBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.CF_PAGES_URL ? `https://${process.env.CF_PAGES_URL}` : "https://editalflash.pages.dev");

// Higieniza qualquer duplicação de protocolo (ex: https://https/...)
const appBaseUrl = rawBaseUrl.replace(/^https?:\/\/(https?:\/\/)?/i, "https://");

export const metadata: Metadata = {
  title: "EditalFlash | Auditoria Preventiva de Habilitação (Art. 62 Lei 14.133)",
  description:
    "Responda antes de disputar: Minha empresa tem risco real de inabilitação? Auditoria preventiva de certidões, balanço (PL ≥ 10%) e atestados com prova de página e linha do edital.",
  metadataBase: new URL(appBaseUrl),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "", // Campo preparado para preenchimento posterior com o token do Search Console
  },
  openGraph: {
    title: "EditalFlash | Auditoria Preventiva de Habilitação",
    description: "Cruzamos seu cofre de documentos com o edital (Art. 62 Lei 14.133/2021) e apontamos vereditos com prova de página e linha.",
    url: appBaseUrl,
    siteName: "EditalFlash",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EditalFlash | Auditoria Preventiva de Habilitação",
    description: "Saiba antes de disputar se sua empresa passa na habilitação (Art. 62 da Lei 14.133).",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-light.svg", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.svg", media: "(prefers-color-scheme: dark)" },
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
      className={`${bricolage.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[var(--bg)] text-[var(--ink)] antialiased selection:bg-[var(--brand)] selection:text-white font-sans">
        <CustomCursor />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
