'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { useOrderStore } from '@/stores/order';
import { Button } from '@/components/common/Button';
import { Separator } from '@/components/common/Separator';
import { formatIDR } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

const steps = [
  { icon: CheckCircle, key: 'step1' },
  { icon: Package, key: 'step2' },
  { icon: Truck, key: 'step3' },
  { icon: Home, key: 'step4' },
];

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const { t } = useLanguage();
  const { currentOrder, getOrderByNumber } = useOrderStore();
  const [copied, setCopied] = useState(false);

  const order = currentOrder || (orderNumber ? getOrderByNumber(orderNumber) : null);

  const handleCopyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link href="/">
            <Button variant="primary">{t('thankYou.continueShopping')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-3xl mx-auto"
        >
          {/* Success Header */}
          <motion.div
            variants={fadeInUp}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {t('thankYou.title')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('thankYou.subtitle')}
            </p>
          </motion.div>

          {/* Order Info Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-lg border border-gray-200 p-6 mb-8"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('thankYou.orderNumber')}</p>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <p className="text-lg font-bold text-primary">{order.orderNumber}</p>
                  <button
                    onClick={handleCopyOrderNumber}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Copy"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('thankYou.orderDate')}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('thankYou.estimatedDelivery')}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {t('thankYou.daysFromNow')}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Order Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({order.items.length} items)</span>
                <span>{formatIDR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('checkout.summary.shipping')}</span>
                <span>{order.shippingCost === 0 ? t('checkout.summary.free') : formatIDR(order.shippingCost)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{t('checkout.summary.total')}</span>
                <span className="text-2xl font-bold text-primary">{formatIDR(order.total)}</span>
              </div>
            </div>
          </motion.div>

          {/* What's Next */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-lg border border-gray-200 p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {t('thankYou.whatNext')}
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const stepTitle = t(`thankYou.${step.key}.title`);
                const stepDescription = t(`thankYou.${step.key}.description`);
                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="relative">
                      <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-0.5 bg-gray-200" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{stepTitle}</h3>
                    <p className="text-sm text-gray-500">{stepDescription}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Need Help */}
          <motion.div
            variants={fadeInUp}
            className="bg-primary/5 rounded-lg border border-primary/20 p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="font-bold text-gray-900 mb-1">{t('thankYou.needHelp')}</h3>
                <p className="text-gray-600">{t('thankYou.contactUs')}</p>
              </div>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" leftIcon={MessageCircle}>
                  {t('thankYou.whatsappButton')}
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/products">
              <Button variant="primary" size="lg" fullWidth>
                {t('thankYou.continueShopping')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full"></div>
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
            <div className="bg-white rounded-lg p-6 mb-8">
              <div className="h-32 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ThankYouContent />
    </Suspense>
  );
}
