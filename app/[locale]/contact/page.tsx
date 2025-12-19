import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ContactPageClient } from "./contact-page-client";

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
    <ContactPageClient
      title={t('title')}
      subtitle={t('subtitle')}
      getInTouch={t('get_in_touch')}
      phone={t('phone')}
      phoneHours={t('phone_hours')}
      email={t('email')}
      emailResponse={t('email_response')}
      address={t('address')}
      addressDetails={t('address_details')}
      hours={t('hours')}
      hoursDetails={t('hours_details')}
      sendMessage={t('send_message')}
      formLabels={{
        name: t('form.name'),
        namePlaceholder: t('form.name_placeholder'),
        email: t('form.email'),
        emailPlaceholder: t('form.email_placeholder'),
        subject: t('form.subject'),
        subjectPlaceholder: t('form.subject_placeholder'),
        message: t('form.message'),
        messagePlaceholder: t('form.message_placeholder'),
        submit: t('form.submit'),
        privacyNote: t('form.privacy_note'),
      }}
    />
  );
}
