export const locales = ["fr", "ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
};

export const localeFlags: Record<Locale, string> = {
  fr: "🇫🇷",
  ar: "🇩🇿",
  en: "🇬🇧",
};

// RTL locales
export const rtlLocales: Locale[] = ["ar"];

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
