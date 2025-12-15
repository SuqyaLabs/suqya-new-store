"use client";

import { useTranslations } from "next-intl";

// Fallback translations for when NextIntlClientProvider is not available
const fallbackTranslations: Record<string, Record<string, string>> = {
  nav: {
    home: "Accueil",
    shop: "Boutique",
    about: "Notre Histoire",
    contact: "Contact",
    cart: "Panier",
    account: "Mon Compte",
    login: "Connexion",
    logout: "Déconnexion",
  },
  shop: {
    addToCart: "Ajouter au panier",
    outOfStock: "Rupture de stock",
  },
  common: {
    search: "Rechercher",
    noResults: "Aucun résultat",
  },
};

/**
 * Safe translation hook that falls back to French when outside NextIntlClientProvider
 */
export function useSafeTranslations(namespace: string) {
  try {
    // Try to use the actual translations
    return useTranslations(namespace);
  } catch {
    // Return a fallback function
    return (key: string) => {
      const ns = fallbackTranslations[namespace];
      return ns?.[key] ?? key;
    };
  }
}
