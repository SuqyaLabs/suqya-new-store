"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  User,
  Truck,
  CreditCard,
  Check,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { useTenant } from "@/hooks/use-tenant";

const steps = [
  { id: 1, name: "Information", icon: User },
  { id: 2, name: "Livraison", icon: Truck },
  { id: 3, name: "Paiement", icon: CreditCard },
];

const wilayas = [
  "Alger",
  "Oran",
  "Constantine",
  "Annaba",
  "Blida",
  "Batna",
  "Sétif",
  "Tizi Ouzou",
  "Béjaïa",
  "Tlemcen",
];

const shippingMethods = [
  {
    id: "yalidine",
    name: "Yalidine Express",
    description: "Livraison à domicile en 3-5 jours",
    price: 500,
  },
  {
    id: "pickup",
    name: "Point Relais",
    description: "Retrait en point relais en 5-7 jours",
    price: 300,
  },
];

const paymentMethods = [
  {
    id: "cod",
    name: "Paiement à la livraison (COD)",
    description: "Payez en espèces à la réception",
    icon: "💵",
  },
  {
    id: "cib",
    name: "Carte CIB / Edahabia",
    description: "Paiement sécurisé par carte",
    icon: "💳",
  },
  {
    id: "transfer",
    name: "Virement bancaire",
    description: "Transfert vers notre compte",
    icon: "🏦",
  },
];

export function CheckoutClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    wilaya: "",
    commune: "",
    shippingMethod: "yalidine",
    paymentMethod: "cod",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const { items, getTotalPrice, clearCart } = useCartStore();
  const toast = useToast();
  const { tenant } = useTenant();
  const subtotal = getTotalPrice();
  const shipping =
    shippingMethods.find((m) => m.id === formData.shippingMethod)?.price || 0;
  const total = subtotal + shipping;

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare order items
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        variantId: item.variant?.id || null,
        variantName: item.variant?.name || null,
        quantity: item.quantity,
        unitPrice: item.product.price + (item.variant?.price_mod || 0),
      }));

      // Call order API
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: tenant?.id,
          customer: {
            email: formData.email,
            phone: formData.phone,
            name: formData.fullName,
          },
          shipping: {
            address: formData.address,
            wilaya: formData.wilaya,
            commune: formData.commune,
            method: formData.shippingMethod,
          },
          payment: {
            method: formData.paymentMethod,
          },
          items: orderItems,
          shippingCost: shipping,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create order");
      }

      setOrderNumber(result.order.orderNumber);
      setIsComplete(true);
      clearCart();
      toast.success("Commande confirmée!", `Numéro: ${result.order.orderNumber}`);
    } catch (error) {
      console.error("Order error:", error);
      toast.error(
        "Erreur de commande",
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isComplete) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-8xl mb-6 block">🛒</span>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Votre panier est vide
          </h1>
          <p className="text-muted-foreground mb-8">
            Ajoutez des produits avant de passer commande.
          </p>
          <Button asChild>
            <Link href="/boutique">Voir la boutique</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-secondary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Commande confirmée !
          </h1>
          {orderNumber && (
            <p className="text-lg font-mono text-primary mb-4 bg-primary/10 px-4 py-2 rounded-lg inline-block">
              {orderNumber}
            </p>
          )}
          <p className="text-muted-foreground mb-8">
            Merci pour votre commande. Vous recevrez un SMS de confirmation
            avec les détails de livraison.
          </p>
          <Button asChild>
            <Link href="/boutique">Continuer mes achats</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft size={20} className="rtl:rotate-180" />
            <span>Retour à la boutique</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 ${
                    currentStep >= step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check size={20} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  <span className="hidden sm:block font-medium">
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 sm:w-24 h-1 mx-2 rounded ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
                {/* Step 1: Contact Info */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      Informations de contact
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            placeholder="votre@email.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Téléphone
                        </label>
                        <div className="relative">
                          <Phone
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            placeholder="0555 123 456"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => updateField("fullName", e.target.value)}
                          placeholder="Prénom et Nom"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Shipping */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      Adresse de livraison
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Adresse complète
                        </label>
                        <div className="relative">
                          <MapPin
                            size={18}
                            className="absolute left-3 top-3 text-muted-foreground"
                          />
                          <textarea
                            value={formData.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            placeholder="Numéro, rue, quartier..."
                            rows={2}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Wilaya
                          </label>
                          <select
                            value={formData.wilaya}
                            onChange={(e) => updateField("wilaya", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          >
                            <option value="">Sélectionner...</option>
                            {wilayas.map((w) => (
                              <option key={w} value={w}>
                                {w}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Commune
                          </label>
                          <input
                            type="text"
                            value={formData.commune}
                            onChange={(e) => updateField("commune", e.target.value)}
                            placeholder="Commune"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Mode de livraison
                        </label>
                        <div className="space-y-3">
                          {shippingMethods.map((method) => (
                            <label
                              key={method.id}
                              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                formData.shippingMethod === method.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="shipping"
                                  value={method.id}
                                  checked={formData.shippingMethod === method.id}
                                  onChange={(e) =>
                                    updateField("shippingMethod", e.target.value)
                                  }
                                  className="sr-only"
                                />
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    formData.shippingMethod === method.id
                                      ? "border-primary"
                                      : "border-muted-foreground"
                                  }`}
                                >
                                  {formData.shippingMethod === method.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    {method.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {method.description}
                                  </p>
                                </div>
                              </div>
                              <span className="font-semibold text-foreground">
                                {formatPrice(method.price)}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      Mode de paiement
                    </h2>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.paymentMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={formData.paymentMethod === method.id}
                            onChange={(e) =>
                              updateField("paymentMethod", e.target.value)
                            }
                            className="sr-only"
                          />
                          <span className="text-2xl">{method.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">
                              {method.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.paymentMethod === method.id
                                ? "border-primary"
                                : "border-muted-foreground"
                            }`}
                          >
                            {formData.paymentMethod === method.id && (
                              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex gap-4 mt-8">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      Retour
                    </Button>
                  )}
                  {currentStep < 3 ? (
                    <Button className="flex-1" onClick={handleNext}>
                      Continuer
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Traitement..."
                        : `Confirmer la commande - ${formatPrice(total)}`}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-sm sticky top-24 border border-border/50">
                <h3 className="font-bold text-foreground mb-4">
                  Résumé de la commande
                </h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => {
                    const price =
                      item.product.price + (item.variant?.price_mod || 0);
                    return (
                      <div
                        key={`${item.product.id}-${item.variant?.id}`}
                        className="flex gap-3"
                      >
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          🍯
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.variant?.name} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="text-foreground">{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  🔒 Paiement sécurisé - Vos données sont protégées
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
