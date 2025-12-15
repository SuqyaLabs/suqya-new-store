"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("errors.404");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Honey pot illustration */}
        <div className="mb-8">
          <span className="text-8xl block mb-4">🍯</span>
          <span className="text-6xl">🐝</span>
        </div>

        {/* Error message */}
        <h1 className="text-4xl font-bold text-warm-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-warm-700 mb-2">
          {t("title")}
        </h2>
        <p className="text-warm-500 mb-8">
          {t("message")}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home size={18} className="mr-2" />
              {t("cta")}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/boutique">
              <Search size={18} className="mr-2" />
              Boutique
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
