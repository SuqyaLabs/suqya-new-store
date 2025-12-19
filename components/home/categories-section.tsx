"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionGradient } from "@/components/theme/section-gradient";

interface CategoryConfig {
  id: string;
  nameKey: string;
  descKey: string;
  image: string;
  href: string;
  color: string;
}

const categories: CategoryConfig[] = [
  {
    id: "miels-purs",
    nameKey: "pureHoneys",
    descKey: "pureHoneysDesc",
    image: "🍯",
    href: "/boutique/miels-purs",
    color: "from-honey-100 to-honey-200",
  },
  {
    id: "miels-infuses",
    nameKey: "infusedHoneys",
    descKey: "infusedHoneysDesc",
    image: "🫚",
    href: "/boutique/miels-infuses",
    color: "from-amber-100 to-amber-200",
  },
  {
    id: "produits-ruche",
    nameKey: "beeProducts",
    descKey: "beeProductsDesc",
    image: "🐝",
    href: "/boutique/produits-ruche",
    color: "from-forest-100 to-forest-200",
  },
  {
    id: "coffrets",
    nameKey: "giftSets",
    descKey: "giftSetsDesc",
    image: "🎁",
    href: "/boutique/coffrets",
    color: "from-rose-100 to-rose-200",
  },
];

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
  const tCat = useTranslations("categories");

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
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <Link href={category.href} className="group block">
                <div
                  className={`relative rounded-2xl p-6 md:p-8 bg-linear-to-br ${category.color} overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border/30`}
                >
                  {/* Icon */}
                  <div className="text-5xl md:text-6xl mb-4">
                    {category.image}
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {tCat(category.nameKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {tCat(category.descKey)}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    {t("viewMore")}
                    <ArrowRight size={16} className="ms-1 rtl:rotate-180" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
