"use client";

import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher, LanguageSwitcherCompact } from "@/components/ui/language-switcher";
import { ProductSearch, SearchModal } from "@/components/search/product-search";
import { useTenant } from "@/hooks/use-tenant";

interface NavLink {
  href: string;
  labelKey: string;
}

const navLinks: NavLink[] = [
  { href: "/boutique", labelKey: "shop" },
  { href: "/notre-histoire", labelKey: "about" },
  { href: "/contact", labelKey: "contact" },
];

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { tenant } = useTenant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openCart, getTotalItems } = useCartStore();
  const itemCount = mounted ? getTotalItems() : 0;

  // Prevent hydration mismatch by only showing cart count after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get brand name from tenant config or fallback
  const brandNameAr = tenant?.config?.brand?.name || tenant?.name || 'سُقيا';
  const brandNameEn = tenant?.config?.brand?.name_en || tenant?.business_name || 'Suqya';
  const displayNameAr = brandNameAr;
  const displayNameLatin = brandNameEn;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      // Escape to close search
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-warm-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -ml-2 text-warm-700 hover:text-warm-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <span className="text-2xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {displayNameAr}
              </span>
            </div>
            <span className="hidden sm:block text-xl font-semibold text-foreground">
              {displayNameLatin}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-warm-600 hover:text-warm-900 hover:bg-warm-100 rounded-lg transition-colors"
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile: Language switcher only */}
            <div className="lg:hidden">
              <LanguageSwitcherCompact />
            </div>
            {/* Desktop: Full actions */}
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            <Button variant="ghost" size="icon" className="hidden lg:flex">
              <Search size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hidden lg:flex">
              <User size={20} />
            </Button>
            {/* Cart: Desktop only - mobile uses bottom nav */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden lg:flex"
              onClick={openCart}
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-honey-600 text-xs font-bold text-warm-900 flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-warm-200 bg-white"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-base font-medium text-warm-700 hover:text-warm-900 hover:bg-warm-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />
    </header>
  );
}
