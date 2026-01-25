import type { Metadata } from "next";
import { Inter, Playfair_Display, Almarai } from "next/font/google";
import "./globals.css";
import { generateTenantMetadata } from "@/lib/tenant/metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const almarai = Almarai({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  return generateTenantMetadata('fr');
}

// Root layout provides base HTML structure
// Locale-specific layout (app/[locale]/layout.tsx) handles i18n, fonts, and UI chrome
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${almarai.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
