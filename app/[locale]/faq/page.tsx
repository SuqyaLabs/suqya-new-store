import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FAQPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.faq' });
  
  return {
    title: `${t('title')} - Suqya Miel Bio | سُقيا`,
    description: t('description'),
  };
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.faq');

  // Get the number of questions from translations
  const questionsCount = 8; // Adjust based on actual number of questions

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

      {/* FAQ Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {/* General Questions */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('categories.general')}
                </h2>
                
                <AccordionItem value="q1" className="border-warm-200">
                  <AccordionTrigger className="text-left text-warm-900 hover:text-honey-600">
                    {t('questions.q1.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-warm-600">
                    {t('questions.q1.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q2" className="border-warm-200">
                  <AccordionTrigger className="text-left text-warm-900 hover:text-honey-600">
                    {t('questions.q2.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-warm-600">
                    {t('questions.q2.answer')}
                  </AccordionContent>
                </AccordionItem>
              </div>

              {/* Product Questions */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('categories.products')}
                </h2>
                
                <AccordionItem value="q3" className="border-warm-200">
                  <AccordionTrigger className="text-left text-warm-900 hover:text-honey-600">
                    {t('questions.q3.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-warm-600">
                    {t('questions.q3.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q4" className="border-warm-200">
                  <AccordionTrigger className="text-left text-warm-900 hover:text-honey-600">
                    {t('questions.q4.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-warm-600">
                    {t('questions.q4.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q5" className="border-warm-200">
                  <AccordionTrigger className="text-left text-warm-900 hover:text-honey-600">
                    {t('questions.q5.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-warm-600">
                    {t('questions.q5.answer')}
                  </AccordionContent>
                </AccordionItem>
              </div>

              {/* Order & Shipping */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('categories.orders')}
                </h2>
                
                <AccordionItem value="q6" className="border-warm-200">
                  <AccordionTrigger className="text-left text-warm-900 hover:text-honey-600">
                    {t('questions.q6.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-warm-600">
                    {t('questions.q6.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q7" className="border-warm-200">
                  <AccordionTrigger className="text-left text-warm-900 hover:text-honey-600">
                    {t('questions.q7.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-warm-600">
                    {t('questions.q7.answer')}
                  </AccordionContent>
                </AccordionItem>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-2xl font-bold text-warm-900 mb-4">
                  {t('categories.payment')}
                </h2>
                
                <AccordionItem value="q8" className="border-warm-200">
                  <AccordionTrigger className="text-left text-warm-900 hover:text-honey-600">
                    {t('questions.q8.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-warm-600">
                    {t('questions.q8.answer')}
                  </AccordionContent>
                </AccordionItem>
              </div>
            </Accordion>

            {/* Still have questions */}
            <div className="mt-16 text-center p-8 bg-warm-50 rounded-2xl">
              <h3 className="text-2xl font-bold text-warm-900 mb-4">
                {t('still_have_questions')}
              </h3>
              <p className="text-warm-600 mb-6">
                {t('contact_us_description')}
              </p>
              <a
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-honey-600 text-white font-semibold hover:bg-honey-700 transition-colors"
              >
                {t('contact_us_button')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
