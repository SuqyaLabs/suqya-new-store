import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CompteClient } from "./compte-client";

interface ComptePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ComptePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.compte' });
  
  return {
    title: `${t('title')} - Suqya Miel Bio | سُقيا`,
    description: t('description'),
  };
}

export default async function ComptePage({ params }: ComptePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CompteClient />;
}
