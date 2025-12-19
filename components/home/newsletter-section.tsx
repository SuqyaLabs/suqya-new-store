"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const t = useTranslations("home.newsletter");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <section className="py-16 md:py-24 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Icon */}
            <span className="text-5xl mb-6 block">🐝</span>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
              {t("title")}
            </h2>
            <p className="text-secondary-foreground/70 mb-8">
              {t("subtitle")}
            </p>

            {/* Form */}
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 text-primary"
              >
                <CheckCircle size={24} />
                <span className="text-lg">{t("success")}</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("placeholder")}
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-secondary-foreground/10 text-secondary-foreground placeholder:text-secondary-foreground/50 border border-secondary-foreground/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <span className="animate-pulse">{t("subscribing")}</span>
                  ) : (
                    <>
                      {t("button")}
                      <Send size={16} className="rtl:rotate-180" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Privacy Note */}
            <p className="text-xs text-secondary-foreground/50 mt-4">
              {t("privacy")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
