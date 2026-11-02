import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Script from "next/script";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["500", "700", "800"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
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
  process.env.NEXT_PUBLIC_APP_URL || "https://editalflash.com.br";

const appBaseUrl = rawBaseUrl.replace(/^https?:\/\/(https?:\/\/)?/i, "https://");

export const metadata: Metadata = {
  title: "EditalFlash | Auditoria Preventiva de Editais e Habilitação",
  description:
    "Auditoria preventiva de editais, verificação de balanço patrimonial, certidões e atestados com prova literal de página e linha perante a Lei 14.133/2021.",
  metadataBase: new URL(appBaseUrl),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/brand/ef-favicon-32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/brand/ef-favicon-16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/brand/ef-icone-app.svg",
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
      className={`${bricolageGrotesque.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} scroll-smooth`}
    >
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="https://unpkg.com/react-grab@0.0.18/dist/index.global.js"
            strategy="beforeInteractive"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen bg-[var(--paper)] text-[var(--ink)] antialiased selection:bg-[#2740F0]/15 selection:text-[var(--ink)] font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
