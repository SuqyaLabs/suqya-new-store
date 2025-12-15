import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.contact' });
  
  return {
    title: `${t('title')} - Suqya Miel Bio | سُقيا`,
    description: t('description'),
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.contact');

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-honey-100 via-white to-forest-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-warm-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-warm-900 mb-8">
                {t('get_in_touch')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-honey-100 text-honey-700 flex items-center justify-center">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-warm-900 mb-1">{t('phone')}</h3>
                    <p className="text-warm-600">+213 555 123 456</p>
                    <p className="text-sm text-warm-500">{t('phone_hours')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-honey-100 text-honey-700 flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-warm-900 mb-1">{t('email')}</h3>
                    <p className="text-warm-600">contact@suqya.dz</p>
                    <p className="text-sm text-warm-500">{t('email_response')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-honey-100 text-honey-700 flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-warm-900 mb-1">{t('address')}</h3>
                    <p className="text-warm-600">
                      {t('address_details')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-honey-100 text-honey-700 flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-warm-900 mb-1">{t('hours')}</h3>
                    <p className="text-warm-600">
                      {t('hours_details')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-warm-50 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-warm-900 mb-6">
                {t('send_message')}
              </h2>
              
              <form className="space-y-6">
                <div>
                  <Label htmlFor="name">{t('form.name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('form.name_placeholder')}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t('form.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('form.email_placeholder')}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">{t('form.subject')}</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder={t('form.subject_placeholder')}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t('form.message')}</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder={t('form.message_placeholder')}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-honey-600 hover:bg-honey-700 text-white"
                  size="lg"
                >
                  {t('form.submit')}
                </Button>
              </form>

              <p className="text-sm text-warm-500 mt-4 text-center">
                {t('form.privacy_note')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
