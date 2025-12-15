import { getTranslatedProductById, getTranslatedProducts } from "@/lib/i18n/translations";
import type { LanguageCode } from "@/lib/i18n/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ProductDetailClient } from "./product-detail-client";

interface ProductPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const product = await getTranslatedProductById(id, locale as LanguageCode);

  if (!product) {
    return { title: "Produit non trouvé - Suqya" };
  }

  return {
    title: product.seo_title || `${product.name} - Suqya Miel Bio`,
    description: product.seo_description || product.short_description || `Découvrez ${product.name} chez Suqya`,
    openGraph: {
      title: product.name,
      description: product.short_description || undefined,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [product, relatedProducts] = await Promise.all([
    getTranslatedProductById(id, locale as LanguageCode),
    getTranslatedProducts(locale as LanguageCode),
  ]);

  if (!product) {
    notFound();
  }

  // Filter out current product and get 4 related
  const related = relatedProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailClient product={product} relatedProducts={related} />;
}
