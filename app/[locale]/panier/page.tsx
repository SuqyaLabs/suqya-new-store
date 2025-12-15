"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const t = useTranslations("cart");
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-8xl mb-6 block">🛒</span>
          <h1 className="text-3xl font-bold text-warm-900 mb-4">
            {t("empty")}
          </h1>
          <p className="text-warm-500 mb-8 max-w-md mx-auto">
            {t("emptyMessage")}
          </p>
          <Button asChild size="lg">
            <Link href="/boutique" className="gap-2">
              <ShoppingBag size={20} />
              {t("discoverHoneys")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shippingEstimate = 500; // Default Yalidine
  const total = subtotal + shippingEstimate;

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-white border-b border-warm-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-warm-900">
            {t("title")} ({getTotalItems()} {t("itemCount", { count: getTotalItems() })})
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const price = item.product.price + (item.variant?.price_mod || 0);
                const itemTotal = price * item.quantity;

                return (
                  <motion.div
                    key={`${item.product.id}-${item.variant?.id}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white rounded-2xl p-4 md:p-6 shadow-sm"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-linear-to-br from-honey-100 to-honey-200 flex items-center justify-center shrink-0">
                        <span className="text-4xl md:text-5xl">🍯</span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-warm-900 text-lg">
                              {item.product.name}
                            </h3>
                            {item.variant && (
                              <p className="text-sm text-warm-500">
                                {t("size")}: {item.variant.name}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id, item.variant?.id)}
                            className="p-2 text-warm-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title={t("remove")}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 border border-warm-200 rounded-xl p-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.variant?.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="h-8 w-8 rounded-lg bg-warm-100 flex items-center justify-center text-warm-600 hover:bg-warm-200 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.variant?.id,
                                  item.quantity + 1
                                )
                              }
                              className="h-8 w-8 rounded-lg bg-warm-100 flex items-center justify-center text-warm-600 hover:bg-warm-200 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-bold text-lg text-honey-700">
                              {formatPrice(itemTotal)}
                            </p>
                            <p className="text-xs text-warm-500">
                              {formatPrice(price)} {t("perUnit")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 text-honey-700 hover:text-honey-800 font-medium"
              >
                <ShoppingBag size={18} />
                {t("continueShopping")}
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-warm-900 mb-4">
                {t("checkout")}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-500">{t("subtotal")}</span>
                  <span className="text-warm-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-500">{t("shippingEstimate")}</span>
                  <span className="text-warm-900">{formatPrice(shippingEstimate)}</span>
                </div>
                <div className="border-t border-warm-200 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-warm-900">{t("total")}</span>
                    <span className="text-honey-700">{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-warm-500 mt-1">
                    {t("shippingNote")}
                  </p>
                </div>
              </div>

              <Button size="xl" className="w-full gap-2" asChild>
                <Link href="/checkout">
                  {t("checkout")}
                  <ArrowRight size={18} />
                </Link>
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-warm-200">
                <div className="flex items-center gap-3 text-sm text-warm-600">
                  <Package size={18} className="text-forest-600" />
                  <span>{t("deliveryInfo")}</span>
                </div>
              </div>

              <p className="text-xs text-warm-500 mt-4 text-center">
                {t("securePayment")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
