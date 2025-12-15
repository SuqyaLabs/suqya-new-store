import { getTranslatedProducts, getTranslatedCategories } from "@/lib/i18n/translations";
import type { LanguageCode } from "@/lib/i18n/types";
import { ProductCard } from "@/components/product/product-card";
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

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero */}
      <section className="bg-linear-to-br from-honey-100 to-forest-50 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-warm-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white border-b border-warm-200 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto hide-scrollbar">
            <Link
              href="/boutique"
              className="px-4 py-2 rounded-full bg-honey-600 text-warm-900 font-medium text-sm whitespace-nowrap"
            >
              {t("filters.all")}
            </Link>
            {Object.entries(categoryMap).map(([slug, { nameKey }]) => (
              <Link
                key={slug}
                href={`/boutique/${slug}`}
                className="px-4 py-2 rounded-full bg-warm-100 text-warm-700 hover:bg-warm-200 font-medium text-sm whitespace-nowrap transition-colors"
              >
                {tFooter(nameKey)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-warm-500">
              {t("products", { count: products.length })}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug ?? undefined}
                price={Number(product.price)}
                image={product.images?.[0] ?? undefined}
                short_description={product.short_description ?? undefined}
                category={product.category_name ?? undefined}
                badges={["bio"]}
                rating={4.8}
                reviewCount={0}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">🍯</span>
              <h3 className="text-xl font-semibold text-warm-700 mb-2">
                {t("noResults")}
              </h3>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
