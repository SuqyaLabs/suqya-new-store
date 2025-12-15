"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("home.hero");
  const tCommon = useTranslations("common");

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-linear-to-br from-honey-50 via-white to-forest-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-honey-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-forest-100 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-honey-100 rounded-full blur-3xl" />
      </div>

      {/* Decorative Honeycomb */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 hidden lg:block rtl:right-auto rtl:left-0">
        <svg width="400" height="400" viewBox="0 0 100 100">
          <pattern id="honeycomb" width="10" height="17.32" patternUnits="userSpaceOnUse">
            <polygon points="5,0 10,2.89 10,8.66 5,11.55 0,8.66 0,2.89" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-honey-600"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#honeycomb)"/>
        </svg>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Brand Name */}
            <span className="inline-block text-4xl md:text-5xl font-bold text-honey-600 mb-4">
              {tCommon("brand")}
            </span>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-900 mb-6 leading-tight">
              {t("title")}{" "}
              <span className="text-honey-600">{t("titleHighlight")}</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-warm-600 mb-4">
              {t("tagline")}
            </p>

            {/* Description */}
            <p className="text-warm-500 text-lg max-w-xl mx-auto mb-8">
              {t("description")}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="xl" asChild>
              <Link href="/boutique" className="gap-2">
                {t("cta")}
                <ArrowRight size={20} className="rtl:rotate-180" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/notre-histoire">{t("ctaSecondary")}</Link>
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mt-12 text-warm-500"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐝</span>
              <span className="text-sm font-medium">{t("trustBadges.bio")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏔️</span>
              <span className="text-sm font-medium">{t("trustBadges.origin")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚚</span>
              <span className="text-sm font-medium">{t("trustBadges.delivery")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💳</span>
              <span className="text-sm font-medium">{t("trustBadges.payment")}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-warm-300 flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-warm-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
