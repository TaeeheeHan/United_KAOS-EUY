'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ruler } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useLanguage } from '@/contexts/LanguageContext';

const sizeRows = [
  { size: 'XS', chest: 46, length: 66, shoulder: 41 },
  { size: 'S', chest: 49, length: 69, shoulder: 43 },
  { size: 'M', chest: 52, length: 71, shoulder: 45 },
  { size: 'L', chest: 55, length: 73, shoulder: 47 },
  { size: 'XL', chest: 58, length: 75, shoulder: 49 },
  { size: 'XXL', chest: 61, length: 77, shoulder: 51 },
];

export default function SizeGuidePage() {
  const { t } = useLanguage();

  const tips = [
    t('sizeGuidePage.tip1'),
    t('sizeGuidePage.tip2'),
    t('sizeGuidePage.tip3'),
    t('sizeGuidePage.tip4'),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t('sizeGuidePage.title')}
          </h1>
          <p className="text-lg text-gray-600">{t('sizeGuidePage.subtitle')}</p>
          <p className="text-sm text-gray-500 mt-3">{t('sizeGuidePage.note')}</p>
        </motion.div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-3 text-sm font-semibold text-gray-800">{t('sizeGuidePage.table.size')}</th>
                <th className="py-3 px-3 text-sm font-semibold text-gray-800">{t('sizeGuidePage.table.chest')}</th>
                <th className="py-3 px-3 text-sm font-semibold text-gray-800">{t('sizeGuidePage.table.length')}</th>
                <th className="py-3 px-3 text-sm font-semibold text-gray-800">{t('sizeGuidePage.table.shoulder')}</th>
              </tr>
            </thead>
            <tbody>
              {sizeRows.map((row) => (
                <tr key={row.size} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-3 px-3 font-semibold text-gray-900">{row.size}</td>
                  <td className="py-3 px-3 text-gray-700">{row.chest} cm</td>
                  <td className="py-3 px-3 text-gray-700">{row.length} cm</td>
                  <td className="py-3 px-3 text-gray-700">{row.shoulder} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">{t('sizeGuidePage.tipsTitle')}</h2>
          </div>
          <ul className="space-y-3 text-gray-700">
            {tips.map((tip, idx) => (
              <li key={`tip-${idx}`} className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-lg font-semibold text-secondary mb-4">{t('sizeGuidePage.helpTitle')}</p>
          <Link href="/contact">
            <Button>{t('sizeGuidePage.helpCta')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
