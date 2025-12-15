"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchResult {
  id: string;
  name: string;
  price: number;
  category_name: string | null;
  short_description: string | null;
}

interface ProductSearchProps {
  className?: string;
  onClose?: () => void;
  expanded?: boolean;
}

export function ProductSearch({ className, onClose, expanded = false }: ProductSearchProps) {
  const t = useTranslations("common");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(expanded);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Search products
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.products || []);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    searchProducts(debouncedQuery);
  }, [debouncedQuery, searchProducts]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    onClose?.();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t("search")}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-warm-200 focus:border-honey-500 focus:ring-2 focus:ring-honey-500/20 outline-none bg-white text-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && (query || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-warm-200 overflow-hidden z-50 max-h-[400px] overflow-y-auto"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-honey-600" />
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/boutique/produit/${product.id}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-warm-50 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-lg bg-honey-100 flex items-center justify-center shrink-0">
                      <span className="text-2xl">🍯</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-warm-900 truncate">
                        {product.name}
                      </p>
                      {product.category_name && (
                        <p className="text-xs text-warm-500">{product.category_name}</p>
                      )}
                    </div>
                    <span className="font-semibold text-honey-700 shrink-0">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="text-center py-8">
                <span className="text-3xl mb-2 block">🔍</span>
                <p className="text-warm-500">{t("noResults")}</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Command palette style search (for Cmd+K)
export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useTranslations("common");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-50"
      >
        <ProductSearch expanded onClose={onClose} />
      </motion.div>
    </>
  );
}
