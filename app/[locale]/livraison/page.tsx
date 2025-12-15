import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Truck, Clock, MapPin, Package } from "lucide-react";

interface LivraisonPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LivraisonPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.livraison' });
  
  return {
    title: `${t('title')} - Suqya Miel Bio | سُقيا`,
    description: t('description'),
  };
}

export default async function LivraisonPage({ params }: LivraisonPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.livraison');

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-honey-100 via-white to-forest-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Truck className="w-16 h-16 mx-auto mb-6 text-honey-600" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-warm-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-warm-900 mb-12 text-center">
            {t('delivery_options')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 border-2 border-warm-200 rounded-2xl hover:border-honey-400 transition-colors">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-honey-100 text-honey-700 mb-4">
                <Truck size={28} />
              </div>
              <h3 className="text-xl font-semibold text-warm-900 mb-2">
                {t('standard_delivery')}
              </h3>
              <p className="text-warm-600 mb-4">{t('standard_delivery_desc')}</p>
              <p className="text-2xl font-bold text-honey-600">{t('standard_price')}</p>
              <p className="text-sm text-warm-500">{t('standard_time')}</p>
            </div>

            <div className="p-6 border-2 border-warm-200 rounded-2xl hover:border-honey-400 transition-colors relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-honey-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                {t('popular')}
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-honey-100 text-honey-700 mb-4">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-semibold text-warm-900 mb-2">
                {t('express_delivery')}
              </h3>
              <p className="text-warm-600 mb-4">{t('express_delivery_desc')}</p>
              <p className="text-2xl font-bold text-honey-600">{t('express_price')}</p>
              <p className="text-sm text-warm-500">{t('express_time')}</p>
            </div>

            <div className="p-6 border-2 border-warm-200 rounded-2xl hover:border-honey-400 transition-colors">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-honey-100 text-honey-700 mb-4">
                <Package size={28} />
              </div>
              <h3 className="text-xl font-semibold text-warm-900 mb-2">
                {t('pickup')}
              </h3>
              <p className="text-warm-600 mb-4">{t('pickup_desc')}</p>
              <p className="text-2xl font-bold text-honey-600">{t('pickup_price')}</p>
              <p className="text-sm text-warm-500">{t('pickup_time')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Areas */}
      <section className="py-16 md:py-24 bg-warm-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-warm-900 mb-12 text-center">
            {t('coverage_areas')}
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <MapPin className="w-12 h-12 text-honey-600 mb-4" />
              <h3 className="text-xl font-semibold text-warm-900 mb-4">
                {t('cities_delivered')}
              </h3>
              <p className="text-warm-600 mb-6">
                {t('coverage_description')}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 
                  'Mostaganem', 'Sidi Bel Abbès', 'Tizi Ouzou', 'Béjaïa'
                ].map((city) => (
                  <div key={city} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-honey-600 rounded-full"></div>
                    <span className="text-warm-700">{city}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-warm-500 mt-6">
                {t('other_cities_note')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Process */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-warm-900 mb-12 text-center">
            {t('delivery_process')}
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: t('process.step1.title'),
                  description: t('process.step1.description')
                },
                {
                  step: '2',
                  title: t('process.step2.title'),
                  description: t('process.step2.description')
                },
                {
                  step: '3',
                  title: t('process.step3.title'),
                  description: t('process.step3.description')
                },
                {
                  step: '4',
                  title: t('process.step4.title'),
                  description: t('process.step4.description')
                }
              ].map((item, index) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-honey-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-warm-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-warm-600">{item.description}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-6 left-full w-full">
                      <div className="w-full h-0.5 bg-honey-200"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-16 md:py-24 bg-warm-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-warm-900 mb-8">
              {t('important_info')}
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-semibold text-warm-900 mb-2">
                  {t('info.packaging.title')}
                </h3>
                <p className="text-warm-600">
                  {t('info.packaging.description')}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-semibold text-warm-900 mb-2">
                  {t('info.timing.title')}
                </h3>
                <p className="text-warm-600">
                  {t('info.timing.description')}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-semibold text-warm-900 mb-2">
                  {t('info.tracking.title')}
                </h3>
                <p className="text-warm-600">
                  {t('info.tracking.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
