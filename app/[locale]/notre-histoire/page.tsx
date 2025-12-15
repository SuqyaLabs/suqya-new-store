import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mountain, Heart, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotreHistoirePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: NotreHistoirePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.about' });
  
  return {
    title: `${t('title')} - Suqya Miel Bio | سُقيا`,
    description: t('description'),
  };
}

export default async function NotreHistoirePage({ params }: NotreHistoirePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.about');

  const milestones = [
    {
      year: "2020",
      title: t('milestones.2020.title'),
      description: t('milestones.2020.description'),
    },
    {
      year: "2022",
      title: t('milestones.2022.title'),
      description: t('milestones.2022.description'),
    },
    {
      year: "2024",
      title: t('milestones.2024.title'),
      description: t('milestones.2024.description'),
    },
    {
      year: "2025",
      title: t('milestones.2025.title'),
      description: t('milestones.2025.description'),
    },
  ];

  const values = [
    {
      icon: Mountain,
      title: t('values.origin.title'),
      description: t('values.origin.description'),
    },
    {
      icon: Heart,
      title: t('values.passion.title'),
      description: t('values.passion.description'),
    },
    {
      icon: Users,
      title: t('values.community.title'),
      description: t('values.community.description'),
    },
    {
      icon: Award,
      title: t('values.quality.title'),
      description: t('values.quality.description'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-honey-100 via-white to-forest-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <span className="text-5xl mb-6 block">🐝</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-900 mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-warm-600 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-warm-900 mb-8 text-center">
              {t('story.title')}
            </h2>
            <div className="prose prose-lg text-warm-600 mx-auto">
              <p>{t('story.paragraph1')}</p>
              <p>{t('story.paragraph2')}</p>
              <p>{t('story.paragraph3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-warm-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-warm-900 mb-12 text-center">
            {t('journey.title')}
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-honey-600 text-warm-900 font-bold flex items-center justify-center text-sm">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-honey-200 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-xl font-semibold text-warm-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-warm-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-warm-900 mb-12 text-center">
            {t('values.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center p-6 rounded-2xl bg-warm-50"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-honey-100 text-honey-700 mb-4">
                  <value.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold text-warm-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-warm-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-honey-500 to-honey-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-warm-800 mb-8 max-w-xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-warm-900 hover:bg-warm-800 text-white px-8 py-4"
          >
            <a href={`/${locale}/boutique`}>
              {t('cta.button')}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
