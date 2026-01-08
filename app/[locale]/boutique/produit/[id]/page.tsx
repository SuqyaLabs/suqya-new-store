import { getTranslatedProductById, getTranslatedProducts } from "@/lib/i18n/translations";
import type { LanguageCode } from "@/lib/i18n/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ProductDetailClient } from "./product-detail-client";
import { resolveComponent, hasCustomComponent } from "@/components/registry";
import { getServerTenantContext } from "@/lib/tenant/server";
import type { BusinessTypeId } from "@/types/multi-business";
import type { ProductDetailsProps } from "@/components/registry";

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

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "c27fb19a-0121-4395-88ca-2cb8374dc52d";

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [product, relatedProducts, tenantContext] = await Promise.all([
    getTranslatedProductById(id, locale as LanguageCode),
    getTranslatedProducts(locale as LanguageCode),
    getServerTenantContext(TENANT_ID),
  ]);

  if (!product) {
    notFound();
  }

  // Filter out current product and get 4 related
  const related = relatedProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // Check if business type has custom ProductDetails component
  const businessType: BusinessTypeId = tenantContext?.tenant?.business_type || 'retail';
  const hasCustomDetails = hasCustomComponent('ProductDetails', businessType);

  if (hasCustomDetails) {
    // Use business-specific ProductDetails component
    const ProductDetails = await resolveComponent<ProductDetailsProps>('ProductDetails', businessType);
    
    return (
      <ProductDetails
        product={{
          id: product.id,
          name: product.name,
          price: Number(product.price),
          images: product.images || [],
          short_description: product.short_description || undefined,
          long_description: product.long_description || undefined,
          custom_data: (product as unknown as { custom_data?: Record<string, unknown> }).custom_data,
          is_available: true,
        }}
        locale={locale}
      />
    );
  }

  // Fall back to default ProductDetailClient
  return <ProductDetailClient product={product} relatedProducts={related} />;
}
