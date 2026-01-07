"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { DynamicProductCard } from "@/components/product/dynamic-product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { TranslatedProduct } from "@/lib/i18n/types";
import { SectionGradient } from "@/components/theme/section-gradient";

interface Category {
  id: string;
  name: string;
  product_count: number;
}

interface BoutiqueClientProps {
  initialProducts: TranslatedProduct[];
}

export function BoutiqueClient({ initialProducts }: BoutiqueClientProps) {
  const t = useTranslations("shop");
  const locale = useLocale();
const [products, setProducts] = useState<TranslatedProduct[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSort, setCurrentSort] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [locale]);

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    // Price filter (only apply if user has set a price range)
    if (priceRange) {
      filtered = filtered.filter(product => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    // Sort
    switch (currentSort) {
      case "priceAsc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        // For now, sort by name as we don't have popularity data
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        // For now, sort by name as we don't have created_at data
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, selectedCategory, currentSort, priceRange]);

  const maxPrice = Math.max(...products.map(p => p.price), 20000);
  const currentPriceRange = priceRange || [0, maxPrice] as [number, number];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <SectionGradient variant="primary" intensity="medium" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Categories Filter - Horizontal */}
      <section className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                !selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t("filters.all")}
            </button>
            {categoriesLoading ? (
              <div className="flex items-center px-4">
                <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            <ShopFilters
              onSortChange={setCurrentSort}
              onPriceRangeChange={handlePriceRangeChange}
              onCategoryChange={handleCategorySelect}
              currentSort={currentSort}
              priceRange={currentPriceRange}
              maxPrice={maxPrice}
              selectedCategory={selectedCategory}
            />
            <p className="text-muted-foreground text-sm whitespace-nowrap">
              {t("products", { count: filteredProducts.length })}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-12 relative">
        <SectionGradient variant="secondary" intensity="light" />
        <div className="container relative z-10 mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DynamicProductCard
                    id={product.id}
                    name={product.name}
                    slug={product.slug ?? undefined}
                    price={Number(product.price)}
                    image={product.images?.[0] ?? undefined}
                    images={product.images ?? undefined}
                    short_description={product.short_description ?? undefined}
                    category={product.category_name ?? undefined}
                    category_id={product.category_id ?? undefined}
                    custom_data={(product as unknown as { custom_data?: Record<string, unknown> }).custom_data}
                    isAvailable={(product as unknown as { is_available?: boolean }).is_available ?? true}
                    badges={["bio"]}
                    rating={4.8}
                    reviewCount={0}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">🍯</span>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t("noProducts")}
              </h3>
              <p className="text-muted-foreground">
                {t("tryDifferentFilters")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
