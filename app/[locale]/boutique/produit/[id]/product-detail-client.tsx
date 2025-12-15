"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  Leaf,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import { useToast } from "@/components/ui/toast";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import type { ProductData } from "@/lib/data/products";

interface Variant {
  id: string;
  name: string;
  price_mod: number;
  sku?: string;
}

interface ProductDetailClientProps {
  product: ProductData;
  relatedProducts: ProductData[];
}

// Default variants if API fails
const defaultVariants: Variant[] = [
  { id: "250g", name: "250g", price_mod: -2000 },
  { id: "500g", name: "500g", price_mod: 0 },
  { id: "1kg", name: "1kg", price_mod: 4000 },
];

const benefits = [
  "Renforce l'immunité",
  "Propriétés antibactériennes",
  "Aide à la cicatrisation",
  "Énergie naturelle",
  "Améliore la digestion",
];

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const t = useTranslations("shop");
  const locale = useLocale();
  const [variants, setVariants] = useState<Variant[]>(defaultVariants);
  const [selectedVariant, setSelectedVariant] = useState<Variant>(defaultVariants[1]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartStore();
  const toast = useToast();

  const images = product.images ?? [];
  const selectedImage = images[selectedImageIndex];

  // Fetch real variants from API
  useEffect(() => {
    async function fetchVariants() {
      try {
        const response = await fetch(`/api/products/${product.id}/variants?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          if (data.variants && data.variants.length > 0) {
            setVariants(data.variants);
            // Select middle variant (usually 500g)
            const middleIndex = Math.floor(data.variants.length / 2);
            setSelectedVariant(data.variants[middleIndex] || data.variants[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch variants:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVariants();
  }, [product.id, locale]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product.id]);

  const currentPrice = Number(product.price) + selectedVariant.price_mod;

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: selectedImage ?? product.images?.[0] ?? undefined,
        short_description: product.short_description || undefined,
      },
      {
        id: selectedVariant.id,
        name: selectedVariant.name,
        price_mod: selectedVariant.price_mod,
      },
      quantity
    );
    toast.success(t("addedToCart"), `${product.name} - ${selectedVariant.name}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 text-warm-600 hover:text-warm-900 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>{t("backToShop")}</span>
        </Link>
      </div>

      {/* Product Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl bg-linear-to-br from-honey-100 to-honey-200 flex items-center justify-center overflow-hidden relative">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <span className="text-[200px]">🍯</span>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.slice(0, 8).map((src, idx) => {
                  const isSelected = idx === selectedImageIndex;

                  return (
                    <button
                      key={`${src}-${idx}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      aria-label={`Voir l'image ${idx + 1} de ${product.name}`}
                      className={`relative aspect-square overflow-hidden rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-500 focus-visible:ring-offset-2 ${
                        isSelected
                          ? "border-honey-500"
                          : "border-warm-200 hover:border-warm-300"
                      }`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="secondary">Bio</Badge>
              <Badge>Kabylie</Badge>
            </div>

            {/* Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-warm-600 hover:text-red-500 transition-colors shadow-sm">
                <Heart size={20} />
              </button>
              <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-warm-600 hover:text-warm-900 transition-colors shadow-sm">
                <Share2 size={20} />
              </button>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Category */}
            {product.category_name && (
              <p className="text-sm text-warm-500 uppercase tracking-wide mb-2">
                {product.category_name}
              </p>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-warm-900 mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < 4 ? "text-honey-500 fill-honey-500" : "text-warm-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-warm-700">4.9</span>
              <span className="text-sm text-warm-500">(127 avis)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-honey-700">
                {formatPrice(currentPrice)}
              </p>
              <p className="text-sm text-warm-500">
                ({(currentPrice / parseInt(selectedVariant.name)).toFixed(2)} DA/g)
              </p>
            </div>

            {/* Description */}
            {product.short_description && (
              <p className="text-warm-600 mb-6 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Size Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-warm-700 mb-3">
                {t("chooseSize")}
              </label>
              <div className="flex gap-3">
                {variants.map((variant) => {
                  const variantPrice = Number(product.price) + variant.price_mod;
                  const isSelected = selectedVariant.id === variant.id;

                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-honey-500 bg-honey-50"
                          : "border-warm-200 hover:border-warm-300"
                      }`}
                    >
                      <p className="font-semibold text-warm-900">
                        {variant.name}
                      </p>
                      <p
                        className={`text-sm ${
                          isSelected ? "text-honey-700" : "text-warm-500"
                        }`}
                      >
                        {formatPrice(variantPrice)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-warm-700 mb-3">
                {t("quantity")}
              </label>
              <div className="inline-flex items-center gap-4 border border-warm-200 rounded-xl p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-lg bg-warm-100 flex items-center justify-center text-warm-600 hover:bg-warm-200 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-lg bg-warm-100 flex items-center justify-center text-warm-600 hover:bg-warm-200 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 mb-8">
              <Button size="xl" className="flex-1 gap-2" onClick={handleAddToCart}>
                <ShoppingCart size={20} />
                {t("addToCart")} - {formatPrice(currentPrice * quantity)}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-warm-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-forest-600" />
                <div>
                  <p className="text-sm font-medium text-warm-900">
                    {t("fastDelivery")}
                  </p>
                  <p className="text-xs text-warm-500">{t("deliveryTime")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-forest-600" />
                <div>
                  <p className="text-sm font-medium text-warm-900">
                    {t("qualityGuarantee")}
                  </p>
                  <p className="text-xs text-warm-500">{t("satisfaction")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Details */}
      <section className="bg-warm-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-warm-900 mb-4">
                Description
              </h2>
              <p className="text-warm-600 leading-relaxed mb-6">
                {product.long_description || product.short_description}
              </p>

              <h3 className="text-lg font-semibold text-warm-900 mb-3">
                Bienfaits
              </h3>
              <ul className="space-y-2">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <Leaf size={16} className="text-forest-600" />
                    <span className="text-warm-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Origin & Traceability */}
            <div>
              <h2 className="text-2xl font-bold text-warm-900 mb-4">
                Origine & Traçabilité
              </h2>
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-honey-600 mt-1" />
                  <div>
                    <p className="font-medium text-warm-900">Région</p>
                    <p className="text-warm-600">Kabylie, Tizi Ouzou</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="font-medium text-warm-900">Récolte</p>
                    <p className="text-warm-600">Été 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">🔢</span>
                  <div>
                    <p className="font-medium text-warm-900">Lot</p>
                    <p className="text-warm-600">SQ-{product.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">🌡️</span>
                  <div>
                    <p className="font-medium text-warm-900">Conservation</p>
                    <p className="text-warm-600">18-25°C, à l&apos;abri de la lumière</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-warm-900 mb-8">
              {t("relatedProducts")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug ?? undefined}
                  price={Number(p.price)}
                  image={p.images?.[0] ?? undefined}
                  short_description={p.short_description ?? undefined}
                  category={p.category_name ?? undefined}
                  badges={["bio"]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
