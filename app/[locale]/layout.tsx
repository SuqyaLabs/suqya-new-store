import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales, isRtlLocale, type Locale } from "@/i18n/config";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNavBar } from "@/components/layout/bottom-nav-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ToastProvider } from "@/components/ui/toast";
import { ScrollToTop } from "@/components/scroll-to-top";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  const isRtl = isRtlLocale(locale as Locale);

  return (
    <div lang={locale} dir={isRtl ? "rtl" : "ltr"} className={isRtl ? "font-arabic" : ""}>
      <NextIntlClientProvider messages={messages}>
        <ToastProvider>
          <ScrollToTop />
          <Header />
          <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
          <Footer />
          <BottomNavBar />
          <CartDrawer />
        </ToastProvider>
      </NextIntlClientProvider>
    </div>
  );
}
