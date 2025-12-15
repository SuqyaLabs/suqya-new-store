"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ProductSearch } from "@/components/search/product-search";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import type { ProductData } from "@/types/database";

interface SearchPageClientProps {
  initialQuery: string;
}

export function SearchPageClient({ initialQuery }: SearchPageClientProps) {
  const t = useTranslations("search");
  const locale = useLocale();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        // Convert search results to ProductData format
        const products: ProductData[] = (data.products || []).map((p: any) => ({
          ...p,
          is_available: true,
          is_online: true,
          created_at: new Date().toISOString(),
        }));
        setResults(products);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    performSearch(newQuery);
  };

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-honey-100 to-forest-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-900 mb-4">
              {t("title")}
            </h1>
            <p className="text-warm-600 mb-8">
              {t("subtitle")}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <ProductSearch expanded onClose={() => {}} />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-warm-900">
                {isLoading ? (
                  t("searching")
                ) : (
                  t("results", { count: results.length })
                )}
              </h2>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                {t("filters")}
              </Button>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-honey-600"></div>
              </div>
            ) : results.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {results.map((product, index) => (
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
                <Search size={48} className="mx-auto text-warm-300 mb-4" />
                <h3 className="text-xl font-semibold text-warm-700 mb-2">
                  {t("noResults.title")}
                </h3>
                <p className="text-warm-500">
                  {t("noResults.description")}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
