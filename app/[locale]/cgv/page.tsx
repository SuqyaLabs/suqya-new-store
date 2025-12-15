import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { FileText, Scale, AlertTriangle, Shield } from "lucide-react";

interface CGVPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CGVPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.cgv' });
  
  return {
    title: `${t('title')} - Suqya Miel Bio | سُقيا`,
    description: t('description'),
  };
}

export default async function CGVPage({ params }: CGVPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.cgv');

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-honey-100 via-white to-forest-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <FileText className="w-16 h-16 mx-auto mb-6 text-honey-600" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-warm-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* CGV Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <div className="bg-warm-50 p-6 rounded-2xl mb-8">
                <p className="text-warm-700">
                  {t('intro')}
                </p>
              </div>

              {/* Article 1: Scope */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4 flex items-center gap-3">
                  <Scale className="w-6 h-6 text-honey-600" />
                  {t('article1.title')}
                </h2>
                <p className="text-warm-600">
                  {t('article1.content')}
                </p>
              </section>

              {/* Article 2: Products */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-honey-600" />
                  {t('article2.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('article2.content')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-warm-600 ml-4">
                  <li>{t('article2.point1')}</li>
                  <li>{t('article2.point2')}</li>
                  <li>{t('article2.point3')}</li>
                  <li>{t('article2.point4')}</li>
                </ul>
              </section>

              {/* Article 3: Prices */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('article3.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('article3.content')}
                </p>
                <p className="text-warm-600">
                  {t('article3.vat')}
                </p>
              </section>

              {/* Article 4: Orders */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('article4.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('article4.content')}
                </p>
                <p className="text-warm-600">
                  {t('article4.confirmation')}
                </p>
              </section>

              {/* Article 5: Payment */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('article5.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('article5.content')}
                </p>
                <div className="bg-warm-50 p-4 rounded-xl">
                  <p className="text-warm-700 font-medium">
                    {t('article5.security')}
                  </p>
                </div>
              </section>

              {/* Article 6: Delivery */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('article6.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('article6.content')}
                </p>
                <p className="text-warm-600">
                  {t('article6.timeline')}
                </p>
              </section>

              {/* Article 7: Returns */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('article7.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('article7.content')}
                </p>
                <p className="text-warm-600">
                  {t('article7.conditions')}
                </p>
              </section>

              {/* Article 8: Warranty */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('article8.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('article8.content')}
                </p>
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mt-4">
                  <p className="text-orange-700">
                    {t('article8.limitations')}
                  </p>
                </div>
              </section>

              {/* Article 9: Intellectual Property */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('article9.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('article9.content')}
                </p>
                <p className="text-warm-600">
                  {t('article9.restrictions')}
                </p>
              </section>

              {/* Article 10: Liability */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                  {t('article10.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('article10.content')}
                </p>
                <p className="text-warm-600">
                  {t('article10.force_majeure')}
                </p>
              </section>

              {/* Article 11: Dispute Resolution */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('article11.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('article11.content')}
                </p>
                <p className="text-warm-600">
                  {t('article11.jurisdiction')}
                </p>
              </section>

              {/* Article 12: Modification */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('article12.title')}
                </h2>
                <p className="text-warm-600">
                  {t('article12.content')}
                </p>
              </section>
            </div>

            {/* Contact Info */}
            <div className="mt-16 p-8 bg-warm-50 rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-warm-900 mb-4">
                {t('questions_title')}
              </h3>
              <p className="text-warm-600 mb-6">
                {t('questions_description')}
              </p>
              <a
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-honey-600 text-white font-semibold hover:bg-honey-700 transition-colors"
              >
                {t('contact_button')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
