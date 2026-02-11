'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

type TermsListProps = {
  title: string;
  items: string[];
};

function TermsListSection({ title, items }: TermsListProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <ul className="space-y-3 text-gray-700">
        {items.map((item, idx) => (
          <li key={`${title}-${idx}`} className="flex items-start gap-3">
            <span className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function TermsPage() {
  const { t } = useLanguage();

  const section2 = [
    t('termsPage.section2Item1'),
    t('termsPage.section2Item2'),
    t('termsPage.section2Item3'),
  ];

  const section3 = [
    t('termsPage.section3Item1'),
    t('termsPage.section3Item2'),
    t('termsPage.section3Item3'),
  ];

  const section4 = [
    t('termsPage.section4Item1'),
    t('termsPage.section4Item2'),
    t('termsPage.section4Item3'),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center mb-2"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t('termsPage.title')}
          </h1>
          <p className="text-lg text-gray-600">{t('termsPage.subtitle')}</p>
          <p className="text-sm text-gray-500 mt-3">
            {t('termsPage.updatedLabel')}: {t('termsPage.updatedDate')}
          </p>
        </motion.div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('termsPage.section1Title')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('termsPage.section1Body')}</p>
        </section>

        <TermsListSection title={t('termsPage.section2Title')} items={section2} />
        <TermsListSection title={t('termsPage.section3Title')} items={section3} />
        <TermsListSection title={t('termsPage.section4Title')} items={section4} />

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('termsPage.section5Title')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('termsPage.section5Body')}</p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('termsPage.section6Title')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('termsPage.section6Body')}</p>
        </section>
      </div>
    </div>
  );
}
