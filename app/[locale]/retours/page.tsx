import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { RotateCcw, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RetoursPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RetoursPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.retours' });
  
  return {
    title: `${t('title')} - Suqya Miel Bio | سُقيا`,
    description: t('description'),
  };
}

export default async function RetoursPage({ params }: RetoursPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.retours');

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-honey-100 via-white to-forest-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <RotateCcw className="w-6 h-6 shrink-0 text-honey-600" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-warm-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Return Policy */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg text-warm-600">
              <p className="lead text-xl text-warm-700">
                {t('policy_intro')}
              </p>
              
              <h2 className="text-2xl font-bold text-warm-900 mt-8 mb-4">
                {t('return_conditions')}
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-honey-600 mt-0.5 shrink-0" />
                  <span>{t('condition1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-honey-600 mt-0.5 shrink-0" />
                  <span>{t('condition2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-honey-600 mt-0.5 shrink-0" />
                  <span>{t('condition3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 shrink-0 text-orange-500 mt-0.5" />
                  <span>{t('condition4')}</span>
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-warm-900 mt-8 mb-4">
                {t('return_deadline')}
              </h2>
              <p>
                {t('deadline_description')}
              </p>

              <h2 className="text-2xl font-bold text-warm-900 mt-8 mb-4">
                {t('how_to_return')}
              </h2>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-honey-600 text-white font-bold flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <strong>{t('step1_title')}</strong>
                    <p>{t('step1_description')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-honey-600 text-white font-bold flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <strong>{t('step2_title')}</strong>
                    <p>{t('step2_description')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-honey-600 text-white font-bold flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <strong>{t('step3_title')}</strong>
                    <p>{t('step3_description')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-honey-600 text-white font-bold flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <strong>{t('step4_title')}</strong>
                    <p>{t('step4_description')}</p>
                  </div>
                </li>
              </ol>

              <h2 className="text-2xl font-bold text-warm-900 mt-8 mb-4">
                {t('refund_options')}
              </h2>
              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="p-6 border-2 border-warm-200 rounded-2xl">
                  <h3 className="font-semibold text-warm-900 mb-2">
                    {t('refund_method1')}
                  </h3>
                  <p className="text-warm-600 text-sm">
                    {t('refund_method1_desc')}
                  </p>
                </div>
                <div className="p-6 border-2 border-warm-200 rounded-2xl">
                  <h3 className="font-semibold text-warm-900 mb-2">
                    {t('refund_method2')}
                  </h3>
                  <p className="text-warm-600 text-sm">
                    {t('refund_method2_desc')}
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-warm-900 mt-8 mb-4">
                {t('exceptions')}
              </h2>
              <p className="text-orange-600 font-medium">
                {t('exceptions_description')}
              </p>

              <h2 className="text-2xl font-bold text-warm-900 mt-8 mb-4">
                {t('contact_support')}
              </h2>
              <p>
                {t('contact_description')}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center p-8 bg-warm-50 rounded-2xl">
              <h3 className="text-2xl font-bold text-warm-900 mb-4">
                {t('need_help')}
              </h3>
              <p className="text-warm-600 mb-6">
                {t('help_description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-honey-600 text-white font-semibold hover:bg-honey-700 transition-colors"
                >
                  {t('contact_us')}
                </a>
                <a
                  href={`/${locale}/faq`}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-warm-300 text-warm-700 font-semibold hover:bg-warm-100 transition-colors"
                >
                  {t('view_faq')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
