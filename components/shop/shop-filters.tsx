"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CategoryFilter } from "./category-filter";

interface ShopFiltersProps {
  onSortChange: (sort: string) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onCategoryChange: (categoryId: string | null) => void;
  currentSort: string;
  priceRange: [number, number];
  selectedCategory: string | null;
  maxPrice?: number;
}

export function ShopFilters({
  onSortChange,
  onPriceRangeChange,
  onCategoryChange,
  currentSort,
  priceRange,
  selectedCategory,
  maxPrice = 20000,
}: ShopFiltersProps) {
  const t = useTranslations("shop.filters");
  const [isOpen, setIsOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const sortOptions = [
    { value: "newest", label: t("sortOptions.newest") },
    { value: "priceAsc", label: t("sortOptions.priceAsc") },
    { value: "priceDesc", label: t("sortOptions.priceDesc") },
    { value: "popular", label: t("sortOptions.popular") },
  ];

  const handlePriceChange = (type: "min" | "max", value: number) => {
    const newRange: [number, number] =
      type === "min"
        ? [value, localPriceRange[1]]
        : [localPriceRange[0], value];
    setLocalPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    onPriceRangeChange(localPriceRange[0], localPriceRange[1]);
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      
      {/* Sort Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-warm-200 bg-white hover:bg-warm-50 transition-colors"
        >
          <SlidersHorizontal size={18} className="text-warm-500" />
          <span className="text-sm font-medium text-warm-700">{t("sort")}</span>
          <ChevronDown
            size={16}
            className={`text-warm-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-warm-200 py-2 min-w-[200px] z-40"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    currentSort === option.value
                      ? "bg-honey-50 text-honey-700 font-medium"
                      : "text-warm-700 hover:bg-warm-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Filter */}
      <PriceFilter
        priceRange={localPriceRange}
        maxPrice={maxPrice}
        onPriceChange={handlePriceChange}
        onApply={applyPriceFilter}
      />
    </div>
  );
}

interface PriceFilterProps {
  priceRange: [number, number];
  maxPrice: number;
  onPriceChange: (type: "min" | "max", value: number) => void;
  onApply: () => void;
}

function PriceFilter({ priceRange, maxPrice, onPriceChange, onApply }: PriceFilterProps) {
  const t = useTranslations("shop.filters");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-warm-200 bg-white hover:bg-warm-50 transition-colors"
      >
        <span className="text-sm font-medium text-warm-700">{t("price")}</span>
        {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
          <span className="h-5 w-5 rounded-full bg-honey-600 text-xs text-warm-900 flex items-center justify-center font-bold">
            1
          </span>
        )}
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
              className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-warm-200 p-4 min-w-[280px] z-40"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-warm-900">{t("price")}</h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-warm-100 rounded"
                >
                  <X size={16} className="text-warm-500" />
                </button>
              </div>

              {/* Range Inputs */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-warm-500 mb-1 block">Min</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => onPriceChange("min", Number(e.target.value))}
                      min={0}
                      max={priceRange[1]}
                      className="w-full px-3 py-2 rounded-lg border border-warm-200 text-sm"
                    />
                  </div>
                  <span className="text-warm-400 mt-5">-</span>
                  <div className="flex-1">
                    <label className="text-xs text-warm-500 mb-1 block">Max</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => onPriceChange("max", Number(e.target.value))}
                      min={priceRange[0]}
                      max={maxPrice}
                      className="w-full px-3 py-2 rounded-lg border border-warm-200 text-sm"
                    />
                  </div>
                </div>

                {/* Range Slider */}
                <div className="px-2">
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => onPriceChange("max", Number(e.target.value))}
                    className="w-full accent-honey-600"
                  />
                  <div className="flex justify-between text-xs text-warm-500 mt-1">
                    <span>{formatPrice(0)}</span>
                    <span>{formatPrice(maxPrice)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    onApply();
                    setIsOpen(false);
                  }}
                  className="w-full"
                  size="sm"
                >
                  Appliquer
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
