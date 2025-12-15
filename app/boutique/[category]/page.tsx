import { getTranslatedProducts } from "@/lib/i18n/translations";
import { DEFAULT_LANGUAGE } from "@/lib/i18n/types";
import { ProductCard } from "@/components/product/product-card";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const categoryConfig: Record<string, { name: string; nameAr: string; description: string }> = {
  "miels-purs": {
    name: "Miels Purs",
    nameAr: "عسل صافي",
    description: "Nos miels purs et naturels, récoltés dans les montagnes d'Algérie.",
  },
  "miels-infuses": {
    name: "Miels Infusés",
    nameAr: "عسل منكه",
    description: "Miels délicatement infusés aux plantes et épices naturelles.",
  },
  "produits-ruche": {
    name: "Produits de la Ruche",
    nameAr: "منتجات الخلية",
    description: "Pollen, propolis et autres trésors de la ruche.",
  },
  coffrets: {
    name: "Coffrets Cadeaux",
    nameAr: "علب هدايا",
    description: "Offrez le meilleur du miel algérien avec nos coffrets cadeaux.",
  },
};

const categoryToDbName: Record<string, string> = {
  "miels-purs": "Miels Purs",
  "miels-infuses": "Miels Infusés",
  "produits-ruche": "Produits de la Ruche",
  coffrets: "Coffrets Cadeaux",
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const config = categoryConfig[category];

  if (!config) {
    return { title: "Catégorie non trouvée - Suqya" };
  }

  return {
    title: `${config.name} - Suqya Miel Bio`,
    description: config.description,
  };
}

export const revalidate = 60;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const config = categoryConfig[category];

  if (!config) {
    notFound();
  }

  const allProducts = await getTranslatedProducts(DEFAULT_LANGUAGE);
  const dbCategoryName = categoryToDbName[category];
  
  // Filter products by category
  const products = allProducts.filter(
    (p) => p.category_name?.toLowerCase() === dbCategoryName.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero */}
      <section className="bg-linear-to-br from-honey-100 to-forest-50 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="text-warm-500 text-sm mb-2 block">{config.nameAr}</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-900 mb-4">
            {config.name}
          </h1>
          <p className="text-warm-600 max-w-2xl mx-auto">{config.description}</p>
        </div>
      </section>

      {/* Breadcrumb & Filters */}
      <section className="bg-white border-b border-warm-200 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto hide-scrollbar">
            <Link
              href="/boutique"
              className="px-4 py-2 rounded-full bg-warm-100 text-warm-700 hover:bg-warm-200 font-medium text-sm whitespace-nowrap transition-colors"
            >
              Tous les produits
            </Link>
            {Object.entries(categoryConfig).map(([slug, { name }]) => (
              <Link
                key={slug}
                href={`/boutique/${slug}`}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                  slug === category
                    ? "bg-honey-600 text-warm-900"
                    : "bg-warm-100 text-warm-700 hover:bg-warm-200"
                }`}
              >
                {name}
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
              {products.length} produit{products.length !== 1 ? "s" : ""}
            </p>
          </div>

          {products.length > 0 ? (
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
          ) : (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">🍯</span>
              <h3 className="text-xl font-semibold text-warm-700 mb-2">
                Aucun produit dans cette catégorie
              </h3>
              <p className="text-warm-500 mb-6">
                Nos produits arrivent bientôt. En attendant, explorez nos autres catégories.
              </p>
              <Link
                href="/boutique"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-honey-600 text-warm-900 font-medium hover:bg-honey-500 transition-colors"
              >
                Voir tous les produits
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
