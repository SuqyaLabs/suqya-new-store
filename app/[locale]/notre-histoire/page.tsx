import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { NotreHistoireClient } from "./notre-histoire-client";

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
      iconName: "Mountain" as const,
      title: t('values.origin.title'),
      description: t('values.origin.description'),
    },
    {
      iconName: "Heart" as const,
      title: t('values.passion.title'),
      description: t('values.passion.description'),
    },
    {
      iconName: "Users" as const,
      title: t('values.community.title'),
      description: t('values.community.description'),
    },
    {
      iconName: "Award" as const,
      title: t('values.quality.title'),
      description: t('values.quality.description'),
    },
  ];

  return (
    <NotreHistoireClient
      locale={locale}
      heroTitle={t('hero.title')}
      heroSubtitle={t('hero.subtitle')}
      storyTitle={t('story.title')}
      storyParagraphs={[t('story.paragraph1'), t('story.paragraph2'), t('story.paragraph3')]}
      journeyTitle={t('journey.title')}
      milestones={milestones}
      valuesTitle={t('values.title')}
      values={values}
      ctaTitle={t('cta.title')}
      ctaSubtitle={t('cta.subtitle')}
      ctaButton={t('cta.button')}
    />
  );
}
