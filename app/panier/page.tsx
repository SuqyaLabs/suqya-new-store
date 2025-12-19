"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-8xl mb-6 block">🛒</span>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Votre panier est vide
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Ajoutez des produits pour commencer vos achats. 
            Nos miels bio n&apos;attendent que vous !
          </p>
          <Button asChild size="lg">
            <Link href="/boutique" className="gap-2">
              <ShoppingBag size={20} />
              Découvrir nos miels
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Mon Panier ({getTotalItems()} {getTotalItems() > 1 ? "articles" : "article"})
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
                    className="bg-card rounded-2xl p-4 md:p-6 shadow-sm border border-border/50"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-4xl md:text-5xl">🍯</span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">
                              {item.product.name}
                            </h3>
                            {item.variant && (
                              <p className="text-sm text-foreground/70">
                                Taille: {item.variant.name}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id, item.variant?.id)}
                            className="p-2 text-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 border border-border rounded-xl p-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.variant?.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-muted/80 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-semibold text-foreground">
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
                              className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-muted/80 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground">
                              {formatPrice(itemTotal)}
                            </p>
                            <p className="text-xs text-foreground/60">
                              {formatPrice(price)} / unité
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
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                <ShoppingBag size={18} />
                Continuer mes achats
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-sm sticky top-24 border border-border/50">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Résumé de la commande
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Sous-total</span>
                  <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Livraison estimée</span>
                  <span className="font-medium text-foreground">{formatPrice(shippingEstimate)}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-foreground/60 mt-1">
                    Livraison calculée à l&apos;étape suivante
                  </p>
                </div>
              </div>

              <Button size="xl" className="w-full gap-2" asChild>
                <Link href="/checkout">
                  Passer la commande
                  <ArrowRight size={18} />
                </Link>
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-3 text-sm text-foreground/70">
                  <Package size={18} className="text-primary" />
                  <span>Livraison 3-5 jours partout en Algérie</span>
                </div>
              </div>

              <p className="text-xs text-foreground/60 mt-4 text-center">
                🔒 Paiement sécurisé • COD accepté
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
