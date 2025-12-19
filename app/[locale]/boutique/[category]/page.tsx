import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { getTranslatedProducts, getTranslatedProductBySlug } from "@/lib/i18n/translations";
import type { LanguageCode } from "@/lib/i18n/types";
import { CategoryPageClient } from "./category-page-client";

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
    <CategoryPageClient
      categoryName={categoryName}
      categoryDescription={categoryDescription}
      products={categoryProducts}
      productCountLabel={t('product_count', { 
        count: categoryProducts.length,
        category: categoryName 
      })}
      noProductsLabel={t('no_products', { category: categoryName })}
    />
  );
}
