"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const tCat = useTranslations("categories");
  const tCommon = useTranslations("common");

  return (
    <footer className="bg-muted/80 dark:bg-muted/40 border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">سُقيا</span>
              <span className="text-xl font-semibold text-foreground">{tCommon("brand")}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("description")}
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/suqya.dz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com/suqya.dz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Boutique Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">{t("shop.title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/boutique"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("shop.allProducts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/boutique/miels-purs"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {tCat("pureHoneys")}
                </Link>
              </li>
              <li>
                <Link
                  href="/boutique/miels-infuses"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {tCat("infusedHoneys")}
                </Link>
              </li>
              <li>
                <Link
                  href="/boutique/produits-ruche"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {tCat("beeProducts")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">{t("info.title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/notre-histoire"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("info.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("info.faq")}
                </Link>
              </li>
              <li>
                <Link
                  href="/livraison"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("info.shipping")}
                </Link>
              </li>
              <li>
                <Link
                  href="/retours"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("info.returns")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">{t("contact.title")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={18} className="shrink-0 mt-0.5 text-primary" />
                <span>{t("contact.address")}</span>
              </li>
              <li>
                <a
                  href={`tel:${t("contact.phone").replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone size={18} className="text-primary" />
                  <span>{t("contact.phone")}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${t("contact.email")}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail size={18} className="text-primary" />
                  <span>{t("contact.email")}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>{t("copyright", { year: new Date().getFullYear() })}</p>
            <div className="flex gap-4">
              <Link
                href="/cgv"
                className="hover:text-primary transition-colors"
              >
                {t("legal.terms")}
              </Link>
              <Link
                href="/confidentialite"
                className="hover:text-primary transition-colors"
              >
                {t("legal.privacy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
