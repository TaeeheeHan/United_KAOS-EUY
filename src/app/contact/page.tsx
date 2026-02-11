'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock3, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t('contactPage.title')}
          </h1>
          <p className="text-lg text-gray-600">{t('contactPage.subtitle')}</p>
          <p className="text-sm text-gray-500 mt-3">{t('contactPage.intro')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-gray-900">{t('contactPage.whatsappLabel')}</h2>
            </div>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              +62 812-3456-7890
            </a>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-gray-900">{t('contactPage.emailLabel')}</h2>
            </div>
            <a href="mailto:hello@kaoseuy.com" className="text-primary font-semibold hover:underline">
              hello@kaoseuy.com
            </a>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock3 className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-gray-900">{t('contactPage.hoursLabel')}</h2>
            </div>
            <p className="text-gray-700">{t('contactPage.hoursValue')}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-gray-900">{t('contactPage.locationLabel')}</h2>
            </div>
            <p className="text-gray-700">{t('contactPage.locationValue')}</p>
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          <Link href="/products">
            <Button fullWidth>{t('contactPage.catalogCta')}</Button>
          </Link>
          <Link href="/order-lookup">
            <Button variant="outline" fullWidth>
              {t('contactPage.lookupCta')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
