'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FAQPage() {
  const { t } = useLanguage();

  const faqs = [
    { q: t('faqPage.q1Title'), a: t('faqPage.q1Answer') },
    { q: t('faqPage.q2Title'), a: t('faqPage.q2Answer') },
    { q: t('faqPage.q3Title'), a: t('faqPage.q3Answer') },
    { q: t('faqPage.q4Title'), a: t('faqPage.q4Answer') },
    { q: t('faqPage.q5Title'), a: t('faqPage.q5Answer') },
    { q: t('faqPage.q6Title'), a: t('faqPage.q6Answer') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t('faqPage.title')}
          </h1>
          <p className="text-lg text-gray-600">{t('faqPage.subtitle')}</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <details
              key={`faq-${idx}`}
              className="group rounded-2xl border border-gray-200 bg-white p-5"
            >
              <summary className="list-none cursor-pointer flex items-center justify-between gap-4">
                <span className="font-semibold text-gray-900">{item.q}</span>
                <ChevronDown className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-lg font-semibold text-secondary mb-4">{t('faqPage.contactPrompt')}</p>
          <Link href="/contact">
            <Button>{t('faqPage.contactCta')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
