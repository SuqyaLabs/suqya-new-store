"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  product_count: number;
}

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const t = useTranslations("shop");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [locale]);

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
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    onCategoryChange(categoryId);
    setIsOpen(false);
  };

  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name || null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-warm-200 bg-white hover:bg-warm-50 transition-colors"
      >
        <span className="text-sm font-medium text-warm-700">
          {selectedCategoryName || t("allCategories")}
        </span>
        {selectedCategory && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCategorySelect(null);
            }}
            className="p-0.5 hover:bg-warm-100 rounded"
          >
            <X size={12} className="text-warm-500" />
          </button>
        )}
        <ChevronDown
          size={16}
          className={`text-warm-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-warm-200 py-2 min-w-[200px] z-40"
            >
              {/* All Categories */}
              <button
                onClick={() => handleCategorySelect(null)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  !selectedCategory
                    ? "bg-honey-50 text-honey-700 font-medium"
                    : "text-warm-700 hover:bg-warm-50"
                }`}
              >
                {t("allCategories")}
              </button>

              {/* Category List */}
              {isLoading ? (
                <div className="px-4 py-2.5 text-sm text-warm-500">
                  {t("loading")}
                </div>
              ) : (
                categories
                  .filter(cat => cat.product_count > 0)
                  .map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                        selectedCategory === category.id
                          ? "bg-honey-50 text-honey-700 font-medium"
                          : "text-warm-700 hover:bg-warm-50"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs text-warm-400">
                        {category.product_count}
                      </span>
                    </button>
                  ))
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
