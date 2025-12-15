"use client";

import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

export function WishlistButton({
  product,
  size = "md",
  className,
  showLabel = false,
}: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full flex items-center justify-center transition-all",
        "bg-white/90 backdrop-blur hover:bg-white shadow-sm",
        sizeClasses[size],
        className
      )}
      aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isWishlisted ? "filled" : "empty"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            size={iconSizes[size]}
            className={cn(
              "transition-colors",
              isWishlisted ? "fill-red-500 text-red-500" : "text-warm-600"
            )}
          />
        </motion.div>
      </AnimatePresence>
      {showLabel && (
        <span className="ml-2 text-sm">
          {isWishlisted ? "Retirer" : "Favoris"}
        </span>
      )}
    </button>
  );
}

// Wishlist count badge for header
export function WishlistBadge() {
  const { getTotalItems } = useWishlistStore();
  const count = getTotalItems();

  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs font-bold text-white flex items-center justify-center">
      {count > 9 ? "9+" : count}
    </span>
  );
}
