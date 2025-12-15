"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Leaf, Mountain, Truck, ShieldCheck, Award, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FeatureConfig {
  key: string;
  icon: LucideIcon;
}

const features: FeatureConfig[] = [
  { key: "bio", icon: Leaf },
  { key: "origin", icon: Mountain },
  { key: "delivery", icon: Truck },
  { key: "payment", icon: ShieldCheck },
  { key: "quality", icon: Award },
  { key: "support", icon: Heart },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  const t = useTranslations("home.features");

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-warm-500 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.key}
              variants={item}
              className="text-center p-6 rounded-2xl bg-warm-50 hover:bg-honey-50 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-honey-100 text-honey-700 mb-4">
                <feature.icon size={28} />
              </div>
              <h3 className="font-semibold text-warm-900 mb-2">
                {t(`${feature.key}.title`)}
              </h3>
              <p className="text-sm text-warm-500">
                {t(`${feature.key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
