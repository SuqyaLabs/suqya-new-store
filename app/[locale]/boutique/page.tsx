import { getTranslatedProducts, getTranslatedCategories } from "@/lib/i18n/translations";
import type { LanguageCode } from "@/lib/i18n/types";
import { BoutiqueClient } from "./boutique-client";
import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Boutique - Suqya Miel Bio | سُقيا",
  description:
    "Découvrez notre sélection de miels bio d'Algérie. Miel de Jujubier, Eucalyptus, Montagne et produits de la ruche.",
};

export const revalidate = 60;

const categoryMap: Record<string, { slugFr: string; nameKey: string }> = {
  "miels-purs": { slugFr: "miels-purs", nameKey: "pureHoneys" },
  "miels-infuses": { slugFr: "miels-infuses", nameKey: "infusedHoneys" },
  "produits-ruche": { slugFr: "produits-ruche", nameKey: "beeProducts" },
};

interface BoutiquePageProps {
  params: Promise<{ locale: string }>;
}

export default async function BoutiquePage({ params }: BoutiquePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("shop");
  const tFooter = await getTranslations("footer.shop");

  const [products] = await Promise.all([
    getTranslatedProducts(locale as LanguageCode),
    getTranslatedCategories(locale as LanguageCode),
  ]);

  return <BoutiqueClient initialProducts={products} />;
}
