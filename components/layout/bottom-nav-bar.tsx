"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Store, ShoppingCart, User, BookOpen, Globe, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { LanguageSwitcherCompact } from "@/components/ui/language-switcher";

const navItems = [
  { key: "home", icon: Home, href: "/" },
  { key: "shop", icon: Store, href: "/boutique" },
  { key: "cart", icon: ShoppingCart, href: "/panier" },
  { key: "about", icon: BookOpen, href: "/notre-histoire" },
  { key: "search", icon: Search, href: "/recherche" },
];

export function BottomNavBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { getTotalItems } = useCartStore();
  const itemCount = getTotalItems();

  // Check if current path matches nav item (considering locale)
  const isActive = (href: string) => {
    // Remove locale from pathname for comparison
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    return pathWithoutLocale === href || 
      (href !== "/" && pathWithoutLocale.startsWith(href));
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-warm-200 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors relative",
                active
                  ? "text-honey-600"
                  : "text-warm-500 hover:text-warm-700"
              )}
            >
              <item.icon 
                size={20} 
                className={cn(
                  item.key === "cart" && "rtl:rotate-180"
                )}
              />
              <span className="text-xs font-medium">
                {t(item.key)}
              </span>
              {/* Cart item count badge */}
              {item.key === "cart" && itemCount > 0 && (
                <span className="absolute -top-1 right-1/4 translate-x-1/2 h-4 w-4 rounded-full bg-honey-600 text-[10px] font-bold text-warm-900 flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
