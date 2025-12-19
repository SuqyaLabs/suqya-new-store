import { setRequestLocale } from "next-intl/server";
import { DynamicHero } from "@/components/hero";
import { CategoriesSection } from "@/components/home/categories-section";
import { BestsellersSection } from "@/components/home/bestsellers-section";
import { FeaturesSection } from "@/components/home/features-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { TenantDebugFloating } from "@/components/debug/tenant-debug-floating";
import { getTranslatedProducts } from "@/lib/i18n/translations";
import type { LanguageCode } from "@/lib/i18n/types";

export const revalidate = 60;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getTranslatedProducts(locale as LanguageCode);

  return (
    <>
      <DynamicHero />
      <CategoriesSection />
      <BestsellersSection products={products} />
      <FeaturesSection />
      <TestimonialsSection />
      <NewsletterSection />
      <TenantDebugFloating />
    </>
  );
}
