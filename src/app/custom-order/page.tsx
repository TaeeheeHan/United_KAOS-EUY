'use client';

import Link from 'next/link';
import Button from '@/components/common/Button';
import { User, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CustomOrderPage() {
  const { t } = useLanguage();

  return (
    <div className="py-12 md:py-20">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-accent text-4xl md:text-6xl text-primary mb-4">
            {t('customOrder.title')}
          </h1>
          <p className="font-body text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('customOrder.subtitle')}
          </p>
        </div>

        {/* Order Type Selection */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center text-secondary mb-8">
            {t('customOrder.selectType')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Order */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 hover:border-primary transition-all">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-secondary mb-2">
                  {t('customOrder.personal.title')}
                </h3>
                <p className="font-body text-gray-600 mb-4">
                  {t('customOrder.personal.description')}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  <p className="font-body text-sm text-gray-700">
                    {t('customOrder.personal.feature1')}
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  <p className="font-body text-sm text-gray-700">
                    {t('customOrder.personal.feature2')}
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  <p className="font-body text-sm text-gray-700">
                    {t('customOrder.personal.feature3')}
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  <p className="font-body text-sm text-gray-700">
                    {t('customOrder.personal.feature4')}
                  </p>
                </div>
              </div>

              <Link href="/custom-order/personal">
                <Button variant="primary" fullWidth>
                  {t('customOrder.personal.button')}
                </Button>
              </Link>
            </div>

            {/* Bulk Order */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 hover:border-accent transition-all">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-4">
                  <Users className="w-10 h-10 text-accent" />
                </div>
                <h3 className="font-display text-2xl font-bold text-secondary mb-2">
                  {t('customOrder.bulk.title')}
                </h3>
                <p className="font-body text-gray-600 mb-4">
                  {t('customOrder.bulk.description')}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  <p className="font-body text-sm text-gray-700">
                    {t('customOrder.bulk.feature1')}
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  <p className="font-body text-sm text-gray-700">
                    {t('customOrder.bulk.feature2')}
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  <p className="font-body text-sm text-gray-700">
                    {t('customOrder.bulk.feature3')}
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  <p className="font-body text-sm text-gray-700">
                    {t('customOrder.bulk.feature4')}
                  </p>
                </div>
              </div>

              <Link href="/custom-order/bulk">
                <Button variant="accent" fullWidth>
                  {t('customOrder.bulk.button')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center bg-background/50 rounded-xl p-6">
            <p className="font-body text-gray-700 mb-4">
              {t('customOrder.help.text')}
            </p>
            <Link href="https://wa.me/6281234567890" target="_blank">
              <Button variant="outline">
                {t('customOrder.help.button')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
