"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const t = useTranslations("cart");
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice } =
    useCartStore();

  const totalPrice = getTotalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <h2 className="text-lg font-semibold text-foreground">
                {t("title")} ({items.length} {t("itemCount", { count: items.length })})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={64} className="text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {t("empty")}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {t("emptyMessage")}
                  </p>
                  <Button onClick={closeCart} asChild>
                    <Link href="/boutique">{t("discoverHoneys")}</Link>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => {
                    const itemPrice = item.product.price + (item.variant?.price_mod || 0);
                    const itemKey = `${item.product.id}-${item.variant?.id || "default"}`;

                    return (
                      <li
                        key={itemKey}
                        className="flex gap-4 bg-muted/50 rounded-xl p-3"
                      >
                        {/* Image */}
                        <div className="relative h-20 w-20 rounded-lg bg-muted overflow-hidden shrink-0">
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-2xl">
                              🍯
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">
                            {item.product.name}
                          </h4>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">
                              {item.variant.name}
                            </p>
                          )}
                          <p className="text-primary font-semibold mt-1">
                            {formatPrice(itemPrice)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.variant?.id,
                                    item.quantity - 1
                                  )
                                }
                                className="h-7 w-7 rounded-md bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center font-medium text-foreground">
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
                                className="h-7 w-7 rounded-md bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                removeItem(item.product.id, item.variant?.id)
                              }
                              className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("subtotal")}</span>
                  <span className="font-semibold text-foreground">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("shippingNote")}
                </p>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout" onClick={closeCart}>
                    {t("checkout")}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={closeCart}
                >
                  {t("continueShopping")}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
