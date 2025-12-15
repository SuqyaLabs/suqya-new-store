"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
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
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-warm-200 px-4 py-4">
              <h2 className="text-lg font-semibold text-warm-900">
                Votre Panier ({items.length} article{items.length !== 1 ? "s" : ""})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-warm-500 hover:text-warm-700 rounded-lg hover:bg-warm-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={64} className="text-warm-300 mb-4" />
                  <h3 className="text-lg font-medium text-warm-700 mb-2">
                    Votre panier est vide
                  </h3>
                  <p className="text-warm-500 text-sm mb-6">
                    Découvrez nos miels bio et produits de la ruche
                  </p>
                  <Button onClick={closeCart} asChild>
                    <Link href="/boutique">Voir la boutique</Link>
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
                        className="flex gap-4 bg-warm-50 rounded-xl p-3"
                      >
                        {/* Image */}
                        <div className="relative h-20 w-20 rounded-lg bg-warm-200 overflow-hidden shrink-0">
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
                          <h4 className="font-medium text-warm-900 truncate">
                            {item.product.name}
                          </h4>
                          {item.variant && (
                            <p className="text-sm text-warm-500">
                              {item.variant.name}
                            </p>
                          )}
                          <p className="text-honey-700 font-semibold mt-1">
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
                                className="h-7 w-7 rounded-md bg-white border border-warm-200 flex items-center justify-center text-warm-600 hover:bg-warm-100 transition-colors"
                              >
                                <Minus size={14} />
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
                                className="h-7 w-7 rounded-md bg-white border border-warm-200 flex items-center justify-center text-warm-600 hover:bg-warm-100 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                removeItem(item.product.id, item.variant?.id)
                              }
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
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
              <div className="border-t border-warm-200 p-4 space-y-4">
                <div className="flex justify-between text-warm-600">
                  <span>Sous-total</span>
                  <span className="font-semibold text-warm-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-warm-500">
                  Frais de livraison calculés au checkout
                </p>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout" onClick={closeCart}>
                    Passer la commande
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={closeCart}
                >
                  Continuer mes achats
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
