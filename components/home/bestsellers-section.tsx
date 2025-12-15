"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug?: string | null;
  price: number;
  images?: string[] | null;
  short_description?: string | null;
  category_name?: string | null;
}

interface BestsellersSectionProps {
  products: Product[];
}

export function BestsellersSection({ products }: BestsellersSectionProps) {
  const t = useTranslations("home.bestsellers");
  const tCommon = useTranslations("common");

  return (
    <section className="py-16 md:py-24 bg-warm-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-2">
              {t("title")}
            </h2>
            <p className="text-warm-500">
              {t("subtitle")}
            </p>
          </div>
          <Button variant="outline" asChild className="self-start md:self-auto">
            <Link href="/boutique" className="gap-2">
              {tCommon("viewAll", { defaultValue: "Voir tout" })}
              <ArrowRight size={16} className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                slug={product.slug ?? undefined}
                price={Number(product.price)}
                image={product.images?.[0] ?? undefined}
                short_description={product.short_description ?? undefined}
                category={product.category_name ?? undefined}
                badges={["bio"]}
                rating={4.8}
                reviewCount={Math.floor(Math.random() * 100) + 20}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Button asChild>
            <Link href="/boutique" className="gap-2">
              {tCommon("viewAllProducts", { defaultValue: "Voir tous les produits" })}
              <ArrowRight size={16} className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
