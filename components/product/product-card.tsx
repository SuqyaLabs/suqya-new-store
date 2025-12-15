"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

interface ProductCardProps {
  id: string;
  name: string;
  slug?: string;
  price: number;
  image?: string;
  short_description?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  badges?: string[];
  isAvailable?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  image,
  short_description,
  category,
  rating = 4.8,
  reviewCount = 0,
  badges = [],
  isAvailable = true,
}: ProductCardProps) {
  const t = useTranslations("shop");
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image, short_description });
  };

  const productUrl = slug ? `/boutique/${slug}` : `/boutique/produit/${id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <Link href={productUrl} className="block">
        {/* Image Container */}
        <div className="relative aspect-square bg-warm-100 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-honey-100 to-honey-200">
              <span className="text-6xl">🍯</span>
            </div>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {badges.includes("bio") && (
                <Badge variant="secondary" className="text-xs">
                  {t("badges.bio")}
                </Badge>
              )}
              {badges.includes("nouveau") && (
                <Badge className="text-xs">{t("badges.nouveau")}</Badge>
              )}
              {badges.includes("promo") && (
                <Badge variant="warning" className="text-xs">
                  {t("badges.promo")}
                </Badge>
              )}
              {badges.includes("bestseller") && (
                <Badge variant="secondary" className="text-xs">
                  {t("badges.bestseller")}
                </Badge>
              )}
              {badges.includes("local") && (
                <Badge variant="outline" className="text-xs">
                  {t("badges.local")}
                </Badge>
              )}
              {badges.includes("artisanal") && (
                <Badge variant="outline" className="text-xs">
                  {t("badges.artisanal")}
                </Badge>
              )}
            </div>
          )}

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3">
            <WishlistButton
              product={{ id, name, price, image, category }}
              size="sm"
            />
          </div>

          {/* Out of Stock Overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-warm-900/60 flex items-center justify-center">
              <span className="text-white font-semibold px-4 py-2 bg-warm-900/80 rounded-lg">
                {t("outOfStock")}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {category && (
            <p className="text-xs text-warm-500 uppercase tracking-wide mb-1">
              {category}
            </p>
          )}

          {/* Title */}
          <h3 className="font-semibold text-warm-900 group-hover:text-honey-700 transition-colors line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Star size={14} className="text-honey-500 fill-honey-500" />
              <span className="text-sm font-medium text-warm-700">{rating}</span>
              <span className="text-sm text-warm-500">({reviewCount} avis)</span>
            </div>
          )}

          {/* Price */}
          <div className="mt-3">
            <p className="text-lg font-bold text-honey-700">
              {formatPrice(price)}
            </p>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className="w-full gap-2"
          size="sm"
        >
          <ShoppingCart size={16} />
          {t("addToCart")}
        </Button>
      </div>
    </motion.article>
  );
}
