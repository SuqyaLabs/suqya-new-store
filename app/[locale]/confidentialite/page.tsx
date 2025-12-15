import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Shield, Eye, Database, UserCheck } from "lucide-react";

interface ConfidentialitePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ConfidentialitePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.confidentialite' });
  
  return {
    title: `${t('title')} - Suqya Miel Bio | سُقيا`,
    description: t('description'),
  };
}

export default async function ConfidentialitePage({ params }: ConfidentialitePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.confidentialite');

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-honey-100 via-white to-forest-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-honey-600" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-warm-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <div className="bg-warm-50 p-6 rounded-2xl mb-8">
                <p className="text-warm-700">
                  {t('intro')}
                </p>
                <p className="text-warm-700 mt-2">
                  {t('company_name')}
                </p>
              </div>

              {/* Data Collection */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4 flex items-center gap-3">
                  <Database className="w-6 h-6 text-honey-600" />
                  {t('data_collection.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('data_collection.content')}
                </p>
                
                <h3 className="text-lg font-semibold text-warm-900 mt-6 mb-3">
                  {t('data_collection.types.title')}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-warm-600 ml-4">
                  <li>{t('data_collection.types.personal')}</li>
                  <li>{t('data_collection.types.contact')}</li>
                  <li>{t('data_collection.types.order')}</li>
                  <li>{t('data_collection.types.payment')}</li>
                  <li>{t('data_collection.types.technical')}</li>
                </ul>
              </section>

              {/* Data Usage */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-honey-600" />
                  {t('data_usage.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('data_usage.content')}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 border border-warm-200 rounded-xl">
                    <h4 className="font-semibold text-warm-900 mb-2">
                      {t('data_usage.purposes.commercial')}
                    </h4>
                    <p className="text-sm text-warm-600">
                      {t('data_usage.purposes.commercial_desc')}
                    </p>
                  </div>
                  <div className="p-4 border border-warm-200 rounded-xl">
                    <h4 className="font-semibold text-warm-900 mb-2">
                      {t('data_usage.purposes.legal')}
                    </h4>
                    <p className="text-sm text-warm-600">
                      {t('data_usage.purposes.legal_desc')}
                    </p>
                  </div>
                  <div className="p-4 border border-warm-200 rounded-xl">
                    <h4 className="font-semibold text-warm-900 mb-2">
                      {t('data_usage.purposes.marketing')}
                    </h4>
                    <p className="text-sm text-warm-600">
                      {t('data_usage.purposes.marketing_desc')}
                    </p>
                  </div>
                  <div className="p-4 border border-warm-200 rounded-xl">
                    <h4 className="font-semibold text-warm-900 mb-2">
                      {t('data_usage.purposes.improvement')}
                    </h4>
                    <p className="text-sm text-warm-600">
                      {t('data_usage.purposes.improvement_desc')}
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Protection */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4 flex items-center gap-3">
                  <UserCheck className="w-6 h-6 text-honey-600" />
                  {t('data_protection.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('data_protection.content')}
                </p>
                
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl mt-4">
                  <p className="text-green-700 font-medium">
                    {t('data_protection.measures')}
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('cookies.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('cookies.content')}
                </p>
                
                <h3 className="text-lg font-semibold text-warm-900 mt-6 mb-3">
                  {t('cookies.types.title')}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-warm-600 ml-4">
                  <li>{t('cookies.types.essential')}</li>
                  <li>{t('cookies.types.analytics')}</li>
                  <li>{t('cookies.types.marketing')}</li>
                </ul>
              </section>

              {/* Third Parties */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('third_parties.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('third_parties.content')}
                </p>
                
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between p-3 bg-warm-50 rounded-lg">
                    <span className="font-medium text-warm-900">{t('third_parties.providers.payment')}</span>
                    <span className="text-warm-600">{t('third_parties.purpose.payment')}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-warm-50 rounded-lg">
                    <span className="font-medium text-warm-900">{t('third_parties.providers.shipping')}</span>
                    <span className="text-warm-600">{t('third_parties.purpose.shipping')}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-warm-50 rounded-lg">
                    <span className="font-medium text-warm-900">{t('third_parties.providers.email')}</span>
                    <span className="text-warm-600">{t('third_parties.purpose.email')}</span>
                  </div>
                </div>
              </section>

              {/* Rights */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('rights.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('rights.content')}
                </p>
                
                <ul className="list-disc list-inside space-y-2 text-warm-600 ml-4">
                  <li>{t('rights.access')}</li>
                  <li>{t('rights.rectification')}</li>
                  <li>{t('rights.deletion')}</li>
                  <li>{t('rights.portability')}</li>
                  <li>{t('rights.objection')}</li>
                </ul>
              </section>

              {/* Data Retention */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('retention.title')}
                </h2>
                <p className="text-warm-600">
                  {t('retention.content')}
                </p>
              </section>

              {/* International Transfers */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('international.title')}
                </h2>
                <p className="text-warm-600">
                  {t('international.content')}
                </p>
              </section>

              {/* Updates */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('updates.title')}
                </h2>
                <p className="text-warm-600">
                  {t('updates.content')}
                </p>
              </section>

              {/* Contact */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('contact.title')}
                </h2>
                <p className="text-warm-600 mb-4">
                  {t('contact.content')}
                </p>
                <div className="bg-warm-50 p-6 rounded-xl">
                  <p className="text-warm-700">
                    {t('contact.email')}: contact@suqya.dz
                  </p>
                  <p className="text-warm-700 mt-2">
                    {t('contact.address')}: Alger, Algérie
                  </p>
                </div>
              </section>
            </div>

            {/* Last Updated */}
            <div className="mt-12 text-center p-6 bg-warm-50 rounded-2xl">
              <p className="text-sm text-warm-600">
                {t('last_updated')}: {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : locale === 'ar' ? 'ar-DZ' : 'en-US')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
