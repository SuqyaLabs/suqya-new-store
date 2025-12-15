import type { Metadata } from "next";
import { Inter, Playfair_Display, Almarai } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Suqya - Miel Bio d'Algérie | سُقيا",
  description:
    "Découvrez notre sélection de miels bio authentiques d'Algérie. Miel de Jujubier, Eucalyptus, Montagne et produits de la ruche. Livraison partout en Algérie.",
  keywords: [
    "miel bio",
    "miel algérie",
    "miel jujubier",
    "sidr",
    "propolis",
    "pollen",
    "عسل",
  ],
  openGraph: {
    title: "Suqya - Miel Bio d'Algérie",
    description: "Du rucher à votre table, le meilleur du miel algérien",
    locale: "fr_DZ",
    type: "website",
  },
};

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
