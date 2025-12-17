"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
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

export function CheckoutClient() {
  const t = useTranslations("checkout");
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
  const subtotal = getTotalPrice();
  
  const shippingMethods = [
    {
      id: "yalidine",
      name: t("shipping.methods.yalidine"),
      description: t("shipping.methods.yalidineDesc"),
      price: 500,
    },
    {
      id: "pickup",
      name: t("shipping.methods.pickup"),
      description: t("shipping.methods.pickupDesc"),
      price: 300,
    },
  ];

  const paymentMethods = [
    {
      id: "cod",
      name: t("payment.methods.cod"),
      description: t("payment.methods.codDesc"),
      icon: "💵",
    },
    {
      id: "cib",
      name: t("payment.methods.cib"),
      description: t("payment.methods.cibDesc"),
      icon: "💳",
    },
    {
      id: "transfer",
      name: t("payment.methods.transfer"),
      description: t("payment.methods.transferDesc"),
      icon: "🏦",
    },
  ];

  const shipping =
    shippingMethods.find((m) => m.id === formData.shippingMethod)?.price || 0;
  const total = subtotal + shipping;

  const steps = [
    { id: 1, name: t("steps.info"), icon: User },
    { id: 2, name: t("steps.shipping"), icon: Truck },
    { id: 3, name: t("steps.payment"), icon: CreditCard },
  ];

  const wilayas = t.raw("wilayas");

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
        throw new Error(result.error || t("errors.orderFailed"));
      }

      setOrderNumber(result.order.orderNumber);
      setIsComplete(true);
      clearCart();
      
      // Save customer info to localStorage for order tracking
      if (typeof window !== 'undefined') {
        localStorage.setItem('suqya_customer_email', formData.email);
        localStorage.setItem('suqya_customer_phone', formData.phone);
      }
      
      toast.success(t("success.title"), `${t("success.orderNumber")}: ${result.order.orderNumber}`);
    } catch (error) {
      console.error("Order error:", error);
      toast.error(
        t("errors.orderFailed"),
        error instanceof Error ? error.message : t("errors.genericError")
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
          <h1 className="text-3xl font-bold text-warm-900 mb-4">
            {t("emptyCart")}
          </h1>
          <p className="text-warm-500 mb-8">
            {t("addProductsFirst")}
          </p>
          <Button asChild>
            <Link href="/boutique">{t("backToShop")}</Link>
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
          <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-forest-600" />
          </div>
          <h1 className="text-3xl font-bold text-warm-900 mb-2">
            {t("success.title")}
          </h1>
          {orderNumber && (
            <p className="text-lg font-mono text-honey-700 mb-4 bg-honey-50 px-4 py-2 rounded-lg inline-block">
              {orderNumber}
            </p>
          )}
          <p className="text-warm-500 mb-8">
            {t("success.message")}
          </p>
          <Button asChild>
            <Link href="/boutique">{t("success.continueShopping")}</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-white border-b border-warm-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-warm-600 hover:text-warm-900"
          >
            <ChevronLeft size={20} className="rtl:rotate-180" />
            <span>{t("backToShop")}</span>
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
                      ? "text-honey-700"
                      : "text-warm-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? "bg-honey-600 text-warm-900"
                        : "bg-warm-200 text-warm-500"
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
                      currentStep > step.id ? "bg-honey-600" : "bg-warm-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                {/* Step 1: Contact Info */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-xl font-bold text-warm-900 mb-6">
                      {t("customer.title")}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-warm-700 mb-2">
                          {t("customer.email")}
                        </label>
                        <div className="relative">
                          <Mail
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400"
                          />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            placeholder={t("fields.emailPlaceholder")}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-warm-200 focus:border-honey-500 focus:ring-2 focus:ring-honey-500/20 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-warm-700 mb-2">
                          {t("customer.phone")}
                        </label>
                        <div className="relative">
                          <Phone
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400"
                          />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            placeholder={t("fields.phonePlaceholder")}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-warm-200 focus:border-honey-500 focus:ring-2 focus:ring-honey-500/20 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-warm-700 mb-2">
                          {t("customer.name")}
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => updateField("fullName", e.target.value)}
                          placeholder={t("fields.namePlaceholder")}
                          className="w-full px-4 py-3 rounded-xl border border-warm-200 focus:border-honey-500 focus:ring-2 focus:ring-honey-500/20 outline-none"
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
                    <h2 className="text-xl font-bold text-warm-900 mb-6">
                      {t("shipping.title")}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-warm-700 mb-2">
                          {t("shipping.address")}
                        </label>
                        <div className="relative">
                          <MapPin
                            size={18}
                            className="absolute left-3 top-3 text-warm-400"
                          />
                          <textarea
                            value={formData.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            placeholder={t("fields.addressPlaceholder")}
                            rows={2}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-warm-200 focus:border-honey-500 focus:ring-2 focus:ring-honey-500/20 outline-none resize-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-warm-700 mb-2">
                            {t("shipping.wilaya")}
                          </label>
                          <select
                            value={formData.wilaya}
                            onChange={(e) => updateField("wilaya", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-warm-200 focus:border-honey-500 focus:ring-2 focus:ring-honey-500/20 outline-none"
                          >
                            <option value="">{t("fields.selectWilaya")}</option>
                            {wilayas.map((w: string) => (
                              <option key={w} value={w}>
                                {w}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-warm-700 mb-2">
                            {t("shipping.commune")}
                          </label>
                          <input
                            type="text"
                            value={formData.commune}
                            onChange={(e) => updateField("commune", e.target.value)}
                            placeholder={t("fields.communePlaceholder")}
                            className="w-full px-4 py-3 rounded-xl border border-warm-200 focus:border-honey-500 focus:ring-2 focus:ring-honey-500/20 outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <label className="block text-sm font-medium text-warm-700 mb-3">
                          {t("shipping.method")}
                        </label>
                        <div className="space-y-3">
                          {shippingMethods.map((method) => (
                            <label
                              key={method.id}
                              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                formData.shippingMethod === method.id
                                  ? "border-honey-500 bg-honey-50"
                                  : "border-warm-200 hover:border-warm-300"
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
                                      ? "border-honey-600"
                                      : "border-warm-300"
                                  }`}
                                >
                                  {formData.shippingMethod === method.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-honey-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-warm-900">
                                    {method.name}
                                  </p>
                                  <p className="text-sm text-warm-500">
                                    {method.description}
                                  </p>
                                </div>
                              </div>
                              <span className="font-semibold text-warm-900">
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
                    <h2 className="text-xl font-bold text-warm-900 mb-6">
                      {t("payment.title")}
                    </h2>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.paymentMethod === method.id
                              ? "border-honey-500 bg-honey-50"
                              : "border-warm-200 hover:border-warm-300"
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
                            <p className="font-medium text-warm-900">
                              {method.name}
                            </p>
                            <p className="text-sm text-warm-500">
                              {method.description}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.paymentMethod === method.id
                                ? "border-honey-600"
                                : "border-warm-300"
                            }`}
                          >
                            {formData.paymentMethod === method.id && (
                              <div className="w-2.5 h-2.5 rounded-full bg-honey-600" />
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
                      {t("back")}
                    </Button>
                  )}
                  {currentStep < 3 ? (
                    <Button className="flex-1" onClick={handleNext}>
                      {t("next")}
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? t("processing")
                        : `${t("placeOrder")} - ${formatPrice(total)}`}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="font-bold text-warm-900 mb-4">
                  {t("summary.title")}
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
                        <div className="w-12 h-12 rounded-lg bg-honey-100 flex items-center justify-center shrink-0">
                          🍯
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-warm-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-warm-500">
                            {item.variant?.name} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-warm-900">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-warm-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-500">{t("summary.subtotal")}</span>
                    <span className="text-warm-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-500">{t("summary.shipping")}</span>
                    <span className="text-warm-900">{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-warm-200">
                    <span className="text-warm-900">{t("summary.total")}</span>
                    <span className="text-honey-700">{formatPrice(total)}</span>
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
    </div>
  );
}
