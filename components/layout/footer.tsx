"use client";

import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { useTenant } from "@/hooks/use-tenant";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
  slug?: string;
}

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const { tenant } = useTenant();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!tenant?.id) {
        console.log('Footer: No tenant id available');
        return;
      }
      
      console.log('Footer: Fetching categories for tenant:', tenant.id);
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('tenant_id', tenant.id)
        .order('name')
        .limit(4);
      
      if (error) {
        console.error('Footer: Error fetching categories:', error);
        return;
      }
      
      console.log('Footer: Categories fetched:', data);
      
      if (data && data.length > 0) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, [tenant?.id]);

  // Get brand name from tenant config or fallback
  const brandNameAr = tenant?.config?.brand?.name || tenant?.name || 'سُقيا';
  const brandNameEn = tenant?.config?.brand?.name_en || tenant?.business_name || 'Suqya';
  const tagline = locale === 'ar' 
    ? (tenant?.config?.brand?.tagline_ar || t("description")) 
    : (tenant?.config?.brand?.tagline || t("description"));

  // Get contact info from tenant config
  const contactConfig = tenant?.config?.contact as { email?: string; phone?: string; address?: string; instagram?: string; facebook?: string } | undefined;
  const contactEmail = contactConfig?.email || tenant?.owner_email || '';
  const contactPhone = contactConfig?.phone || '';
  const contactAddress = contactConfig?.address || '';
  const instagramUrl = contactConfig?.instagram || '';
  const facebookUrl = contactConfig?.facebook || '';

  return (
    <footer className="bg-muted/80 dark:bg-muted/40 border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">{brandNameAr}</span>
              <span className="text-xl font-semibold text-foreground">{brandNameEn}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {tagline}
            </p>
            {(instagramUrl || facebookUrl) && (
              <div className="flex gap-4">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                )}
              </div>
            )}
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
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/boutique?category=${category.id}`}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
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
              {contactAddress && (
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin size={18} className="shrink-0 mt-0.5 text-primary" />
                  <span>{contactAddress}</span>
                </li>
              )}
              {contactPhone && (
                <li>
                  <a
                    href={`tel:${contactPhone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone size={18} className="text-primary" />
                    <span>{contactPhone}</span>
                  </a>
                </li>
              )}
              {contactEmail && (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail size={18} className="text-primary" />
                    <span>{contactEmail}</span>
                  </a>
                </li>
              )}
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
