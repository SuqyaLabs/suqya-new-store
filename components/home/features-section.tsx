"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Leaf, Mountain, Truck, ShieldCheck, Award, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionGradient } from "@/components/theme/section-gradient";

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
    <section className="py-16 md:py-24 relative overflow-hidden">
      <SectionGradient variant="primary" intensity="medium" />
      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
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
              className="text-center p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-accent/50 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                <feature.icon size={28} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {t(`${feature.key}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(`${feature.key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
