"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { SectionGradient } from "@/components/theme/section-gradient";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  slug: string;
  product_count: number;
}

// Color palette for categories (cycles through)
const categoryColors = [
  "from-primary/15 to-primary/25",
  "from-secondary/15 to-secondary/25",
  "from-accent/40 to-accent/60",
  "from-muted to-muted/80",
];

// Default emoji icons for categories (can be overridden by DB)
const defaultIcons: Record<string, string> = {
  "miels-purs": "🍯",
  "miels-infuses": "🫚",
  "produits-ruche": "🐝",
  "coffrets": "🎁",
  "default": "📦",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function CategoriesSection() {
  const t = useTranslations("home.categories");
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const supabase = createClient();
        const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;

        // Fetch categories with translations and product count
        const { data: categoriesData, error: catError } = await supabase
          .from("categories")
          .select(`
            id,
            name,
            category_translations(
              name,
              language_code
            )
          `)
          .eq("tenant_id", tenantId)
          .eq("type", "retail")
          .order("name");

        if (catError) {
          console.error("Error fetching categories:", catError);
          setIsLoading(false);
          return;
        }

        // Get product counts per category
        const { data: productsData } = await supabase
          .from("products")
          .select("category_id")
          .eq("tenant_id", tenantId)
          .eq("is_available", true)
          .eq("is_online", true);

        // Count products per category
        const productCounts = new Map<string, number>();
        productsData?.forEach((product) => {
          if (product.category_id) {
            productCounts.set(
              product.category_id,
              (productCounts.get(product.category_id) || 0) + 1
            );
          }
        });

        // Build result with translated names
        const result = categoriesData
          ?.map((category) => {
            const translation = (category.category_translations as Array<{ name: string; language_code: string }>)?.find(
              (t) => t.language_code === locale
            );

            const categoryName = translation?.name || category.name;
            return {
              id: category.id,
              name: categoryName,
              slug: categoryName.toLowerCase().replace(/\s+/g, "-"),
              product_count: productCounts.get(category.id) || 0,
            };
          })
          .filter((cat) => cat.product_count > 0) || [];

        setCategories(result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, [locale]);

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-16 md:py-24 relative overflow-hidden">
        <SectionGradient variant="secondary" intensity="light" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // No categories found
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <SectionGradient variant="secondary" intensity="light" />
      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((category, index) => {
            const color = categoryColors[index % categoryColors.length];
            const icon = defaultIcons[category.slug] || defaultIcons.default;
            const href = `/boutique/${category.slug}`;

            return (
              <motion.div key={category.id} variants={item} className="h-full">
                <Link href={href} className="group block h-full">
                  <div
                    className={`relative rounded-2xl p-6 md:p-8 bg-linear-to-br ${color} overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border/30 h-full flex flex-col`}
                  >
                    {/* Icon */}
                    <div className="text-5xl md:text-6xl mb-4">
                      {icon}
                    </div>

                    {/* Content - flex-grow to push arrow to bottom */}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-2">
                        {category.name}
                      </h3>
                      {category.product_count !== undefined && category.product_count > 0 && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {category.product_count} {category.product_count === 1 ? t("product") : t("products")}
                        </p>
                      )}
                    </div>

                    {/* Arrow - always at bottom */}
                    <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform mt-auto pt-2">
                      {t("viewMore")}
                      <ArrowRight size={16} className="ms-1 rtl:rotate-180" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
