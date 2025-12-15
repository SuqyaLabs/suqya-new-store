import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { getTranslatedProducts, getTranslatedProductBySlug } from "@/lib/i18n/translations";
import type { LanguageCode } from "@/lib/i18n/types";

interface CategoryPageProps {
  params: Promise<{ 
    locale: string;
    category: string;
  }>;
}

export async function generateStaticParams() {
  const categories = [
    { category: 'miels-purs' },
    { category: 'miels-infuses' },
    { category: 'produits-ruche' }
  ];
  
  const locales = ['fr', 'ar', 'en'];
  
  return locales.flatMap(locale => 
    categories.map(category => ({
      locale,
      category: category.category,
    }))
  );
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.category' });
  
  const categoryNames = {
    'miels-purs': t('categories.miels_purs'),
    'miels-infuses': t('categories.miels_infuses'),
    'produits-ruche': t('categories.produits_ruche'),
  };
  
  const categoryName = categoryNames[category as keyof typeof categoryNames] || category;
  
  return {
    title: `${categoryName} - Suqya Miel Bio | سُقيا`,
    description: t('description', { category: categoryName }),
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('pages.category');
  
  // Validate category
  const validCategories = ['miels-purs', 'miels-infuses', 'produits-ruche'];
  if (!validCategories.includes(category)) {
    notFound();
  }
  
  // Get all products
  const allProducts = await getTranslatedProducts(locale as LanguageCode);
  
  // Filter products by category
  const categoryProducts = allProducts.filter(product => {
    // Map category slugs to category types
    const categoryTypeMap: Record<string, string> = {
      'miels-purs': 'pure_honeys',
      'miels-infuses': 'infused_honeys',
      'produits-ruche': 'bee_products'
    };
    
    const expectedType = categoryTypeMap[category];
    
    // Check if product has category info and matches the expected type
    // We need to check the category_name which should contain the translated category name
    // or check if the product's category_id matches the expected category
    return product.category_name?.toLowerCase().includes(expectedType?.replace('_', ' ') || '') ||
           product.category_id === expectedType;
  });
  
  const categoryNames = {
    'miels-purs': t('categories.miels_purs'),
    'miels-infuses': t('categories.miels_infuses'),
    'produits-ruche': t('categories.produits_ruche'),
  };
  
  const categoryName = categoryNames[category as keyof typeof categoryNames];
  
  const categoryDescriptions = {
    'miels-purs': t('descriptions.miels_purs'),
    'miels-infuses': t('descriptions.miels_infuses'),
    'produits-ruche': t('descriptions.produits_ruche'),
  };
  
  const categoryDescription = categoryDescriptions[category as keyof typeof categoryDescriptions];
  
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-honey-100 via-white to-forest-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-warm-900 mb-6">
              {categoryName}
            </h1>
            <p className="text-xl text-warm-600 max-w-2xl mx-auto">
              {categoryDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {categoryProducts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-warm-600">
                  {t('product_count', { 
                    count: categoryProducts.length,
                    category: categoryName 
                  })}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug || undefined}
                    price={product.price}
                    image={product.images?.[0]}
                    short_description={product.short_description || undefined}
                    category={product.category_name || undefined}
                    isAvailable={product.is_available}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-warm-600 text-lg">
                {t('no_products', { category: categoryName })}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
