"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-warm-100 transition-colors"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Globe size={18} className="text-warm-600" />
        <span className="text-sm font-medium text-warm-700">
          {localeFlags[locale]} {localeNames[locale]}
        </span>
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
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border border-warm-200 py-2 min-w-[160px] z-50"
          >
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  locale === loc
                    ? "bg-honey-50 text-honey-700"
                    : "text-warm-700 hover:bg-warm-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{localeFlags[loc]}</span>
                  <span className={loc === "ar" ? "font-arabic" : ""}>
                    {localeNames[loc]}
                  </span>
                </span>
                {locale === loc && <Check size={16} className="text-honey-600" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact version for mobile
export function LanguageSwitcherCompact() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  const nextLocale = locales[(locales.indexOf(locale) + 1) % locales.length];

  return (
    <button
      onClick={() => handleLocaleChange(nextLocale)}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-warm-100 transition-colors"
      aria-label={`Switch to ${localeNames[nextLocale]}`}
    >
      <span className="text-lg">{localeFlags[locale]}</span>
    </button>
  );
}
