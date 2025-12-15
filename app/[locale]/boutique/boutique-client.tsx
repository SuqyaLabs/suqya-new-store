"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { ProductData } from "@/types/database";

interface BoutiqueClientProps {
  initialProducts: ProductData[];
}

export function BoutiqueClient({ initialProducts }: BoutiqueClientProps) {
  const t = useTranslations("shop");
  const locale = useLocale();
  const [products, setProducts] = useState<ProductData[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSort, setCurrentSort] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category_id === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (currentSort) {
      case "priceAsc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return filtered;
  }, [products, selectedCategory, currentSort, priceRange]);

  const maxPrice = Math.max(...products.map(p => p.price), 20000);

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

      {/* Filters */}
      <section className="bg-white border-b border-warm-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <ShopFilters
            onSortChange={setCurrentSort}
            onPriceRangeChange={handlePriceRangeChange}
            onCategoryChange={setSelectedCategory}
            currentSort={currentSort}
            priceRange={priceRange}
            selectedCategory={selectedCategory}
            maxPrice={maxPrice}
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-honey-600" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    image={product.image}
                    short_description={product.short_description}
                    category={product.category_name}
                    isAvailable={product.is_available}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-warm-500 text-lg">{t("noProducts")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
