"use client";

import { Link } from "@/i18n/routing";
import { Mountain, Heart, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionGradient } from "@/components/theme/section-gradient";
import { motion } from "framer-motion";

const iconMap = {
  Mountain,
  Heart,
  Users,
  Award,
} as const;

type IconName = keyof typeof iconMap;

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface Value {
  iconName: IconName;
  title: string;
  description: string;
}

interface NotreHistoireClientProps {
  locale: string;
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  journeyTitle: string;
  milestones: Milestone[];
  valuesTitle: string;
  values: Value[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

export function NotreHistoireClient({
  locale,
  heroTitle,
  heroSubtitle,
  storyTitle,
  storyParagraphs,
  journeyTitle,
  milestones,
  valuesTitle,
  values,
  ctaTitle,
  ctaSubtitle,
  ctaButton,
}: NotreHistoireClientProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <SectionGradient variant="primary" intensity="medium" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl mb-6 block"
          >
            🐝
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            {heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <SectionGradient variant="secondary" intensity="light" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              {storyTitle}
            </h2>
            <div className="prose prose-lg text-muted-foreground mx-auto space-y-4">
              {storyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <SectionGradient variant="primary" intensity="light" />
        <div className="container relative z-10 mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            {journeyTitle}
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div 
                  key={milestone.year} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-primary/20 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <SectionGradient variant="secondary" intensity="medium" />
        <div className="container relative z-10 mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            {valuesTitle}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = iconMap[value.iconName];
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-6">
            {ctaTitle}
          </h2>
          <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">
            {ctaSubtitle}
          </p>
          <Button
            asChild
            size="lg"
            variant="default"
            className="px-8"
          >
            <Link href="/boutique">
              {ctaButton}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
