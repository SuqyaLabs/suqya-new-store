import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { SearchPageClient } from "./search-client";

export const metadata: Metadata = {
  title: "Recherche - Suqya Miel Bio | سُقيا",
  description: "Recherchez nos produits de miel bio et produits de la ruche.",
};

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("search");

  return <SearchPageClient initialQuery={q || ""} />;
}
