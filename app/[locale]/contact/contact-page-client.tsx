"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionGradient } from "@/components/theme/section-gradient";
import { motion } from "framer-motion";

interface ContactPageClientProps {
  title: string;
  subtitle: string;
  getInTouch: string;
  phone: string;
  phoneHours: string;
  email: string;
  emailResponse: string;
  address: string;
  addressDetails: string;
  hours: string;
  hoursDetails: string;
  sendMessage: string;
  formLabels: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    subject: string;
    subjectPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    privacyNote: string;
  };
}

export function ContactPageClient({
  title,
  subtitle,
  getInTouch,
  phone,
  phoneHours,
  email,
  emailResponse,
  address,
  addressDetails,
  hours,
  hoursDetails,
  sendMessage,
  formLabels,
}: ContactPageClientProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <SectionGradient variant="primary" intensity="medium" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <SectionGradient variant="secondary" intensity="light" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-foreground mb-8">
                {getInTouch}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{phone}</h3>
                    <p className="text-muted-foreground">+213 555 123 456</p>
                    <p className="text-sm text-muted-foreground/70">{phoneHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{email}</h3>
                    <p className="text-muted-foreground">contact@suqya.dz</p>
                    <p className="text-sm text-muted-foreground/70">{emailResponse}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{address}</h3>
                    <p className="text-muted-foreground">
                      {addressDetails}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{hours}</h3>
                    <p className="text-muted-foreground">
                      {hoursDetails}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card p-8 rounded-2xl border border-border/50"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {sendMessage}
              </h2>
              
              <form className="space-y-6">
                <div>
                  <Label htmlFor="name">{formLabels.name}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={formLabels.namePlaceholder}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">{formLabels.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={formLabels.emailPlaceholder}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">{formLabels.subject}</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder={formLabels.subjectPlaceholder}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">{formLabels.message}</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder={formLabels.messagePlaceholder}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  size="lg"
                >
                  {formLabels.submit}
                </Button>
              </form>

              <p className="text-sm text-muted-foreground mt-4 text-center">
                {formLabels.privacyNote}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
