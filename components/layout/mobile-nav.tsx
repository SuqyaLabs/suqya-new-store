"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingCart, User, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/boutique", icon: Store, label: "Boutique" },
  { href: "/panier", icon: ShoppingCart, label: "Panier" },
  { href: "/notre-histoire", icon: BookOpen, label: "Notre Histoire" },
  { href: "/compte", icon: User, label: "Compte" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-warm-200 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                isActive
                  ? "text-honey-600"
                  : "text-warm-500 hover:text-warm-700"
              )}
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
