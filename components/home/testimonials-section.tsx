"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionGradient } from "@/components/theme/section-gradient";

interface Review {
  name: string;
  location: string;
  text: string;
  product: string;
}

export function TestimonialsSection() {
  const t = useTranslations("home.testimonials");
  
  // Get reviews from translations
  const reviews: Review[] = [
    {
      name: t("reviews.0.name"),
      location: t("reviews.0.location"),
      text: t("reviews.0.text"),
      product: t("reviews.0.product"),
    },
    {
      name: t("reviews.1.name"),
      location: t("reviews.1.location"),
      text: t("reviews.1.text"),
      product: t("reviews.1.product"),
    },
    {
      name: t("reviews.2.name"),
      location: t("reviews.2.location"),
      text: t("reviews.2.text"),
      product: t("reviews.2.product"),
    },
    {
      name: t("reviews.3.name"),
      location: t("reviews.3.location"),
      text: t("reviews.3.text"),
      product: t("reviews.3.product"),
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <SectionGradient variant="secondary" intensity="medium" />
      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border/50"
            >
              {/* Quote Icon */}
              <Quote size={32} className="text-primary/20 mb-4 rtl:scale-x-[-1]" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-primary fill-primary"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/80 mb-4 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    {review.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{review.location}</p>
                </div>
                <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {review.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
