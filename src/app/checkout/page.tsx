'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, Wallet, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useOrderStore, generateOrderNumber, PaymentMethod } from '@/stores/order';
import { Button } from '@/components/common/Button';
import { Separator } from '@/components/common/Separator';
import { formatIDR } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

const PROVINCES = [
  'Aceh', 'Bali', 'Banten', 'Bengkulu', 'DI Yogyakarta', 'DKI Jakarta',
  'Gorontalo', 'Jambi', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
  'Kalimantan Barat', 'Kalimantan Selatan', 'Kalimantan Tengah',
  'Kalimantan Timur', 'Kalimantan Utara', 'Kepulauan Bangka Belitung',
  'Kepulauan Riau', 'Lampung', 'Maluku', 'Maluku Utara',
  'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Papua', 'Papua Barat',
  'Riau', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tengah',
  'Sulawesi Tenggara', 'Sulawesi Utara', 'Sumatera Barat',
  'Sumatera Selatan', 'Sumatera Utara'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const { setCurrentOrder, addToHistory } = useOrderStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const checkoutSchema = z.object({
    fullName: z.string().min(2, t('checkout.errors.nameMin')),
    email: z.string().email(t('checkout.errors.emailInvalid')),
    phone: z.string().min(10, t('checkout.errors.phoneMin')),
    address: z.string().min(10, t('checkout.errors.addressMin')),
    city: z.string().min(1, t('checkout.errors.cityRequired')),
    province: z.string().min(1, t('checkout.errors.provinceRequired')),
    postalCode: z.string().min(5, t('checkout.errors.postalCodeRequired')),
    notes: z.string().optional(),
  });

  type CheckoutForm = z.infer<typeof checkoutSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const subtotal = mounted ? getTotal() : 0;
  const shippingCost = 0;
  const grandTotal = subtotal + shippingCost;

  const onSubmit = async (data: CheckoutForm) => {
    if (!selectedPayment) {
      alert(t('checkout.errors.paymentRequired'));
      return;
    }
    if (!agreeTerms) {
      alert(t('checkout.errors.termsRequired'));
      return;
    }

    setIsSubmitting(true);

    const orderNumber = generateOrderNumber();
    const order = {
      id: orderNumber,
      orderNumber,
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        size: item.size,
        color: item.color.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingInfo: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        notes: data.notes,
      },
      paymentMethod: selectedPayment,
      subtotal,
      shippingCost,
      total: grandTotal,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    // Simulate order processing
    setTimeout(() => {
      setCurrentOrder(order);
      addToHistory(order);
      clearCart();
      router.push(`/checkout/thank-you?order=${orderNumber}`);
    }, 1500);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg p-6 h-96"></div>
              </div>
              <div className="bg-white rounded-lg p-6 h-64"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('cart.empty')}</h1>
          <p className="text-gray-600 mb-8">{t('cart.emptyDescription')}</p>
          <Link href="/products">
            <Button variant="primary">{t('cart.browseProducts')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('checkout.backToCart')}
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t('checkout.title')}
          </h1>
          <p className="text-gray-600 mt-2">{t('checkout.subtitle')}</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="lg:col-span-2 space-y-6"
            >
              {/* Shipping Information */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  {t('checkout.shippingInfo')}
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-2">
                      {t('checkout.fields.fullName')} *
                    </label>
                    <input
                      type="text"
                      {...register('fullName')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('checkout.fields.fullNamePlaceholder')}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      {t('checkout.fields.email')} *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('checkout.fields.emailPlaceholder')}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      {t('checkout.fields.phone')} *
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('checkout.fields.phonePlaceholder')}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-2">
                      {t('checkout.fields.address')} *
                    </label>
                    <textarea
                      {...register('address')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('checkout.fields.addressPlaceholder')}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      {t('checkout.fields.city')} *
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('checkout.fields.cityPlaceholder')}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      {t('checkout.fields.province')} *
                    </label>
                    <select
                      {...register('province')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">{t('checkout.fields.provincePlaceholder')}</option>
                      {PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                    {errors.province && (
                      <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      {t('checkout.fields.postalCode')} *
                    </label>
                    <input
                      type="text"
                      {...register('postalCode')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('checkout.fields.postalCodePlaceholder')}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-2">
                      {t('checkout.fields.notes')}
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('checkout.fields.notesPlaceholder')}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  {t('checkout.paymentMethod')}
                </h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPayment === 'bank_transfer'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="bank_transfer"
                      checked={selectedPayment === 'bank_transfer'}
                      onChange={() => setSelectedPayment('bank_transfer')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{t('checkout.payment.bankTransfer')}</p>
                      <p className="text-sm text-gray-500">{t('checkout.payment.bankTransferDesc')}</p>
                    </div>
                    {selectedPayment === 'bank_transfer' && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPayment === 'cod'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={selectedPayment === 'cod'}
                      onChange={() => setSelectedPayment('cod')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <Truck className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{t('checkout.payment.cod')}</p>
                      <p className="text-sm text-gray-500">{t('checkout.payment.codDesc')}</p>
                    </div>
                    {selectedPayment === 'cod' && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPayment === 'ewallet'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="ewallet"
                      checked={selectedPayment === 'ewallet'}
                      onChange={() => setSelectedPayment('ewallet')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <Wallet className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{t('checkout.payment.ewallet')}</p>
                      <p className="text-sm text-gray-500">{t('checkout.payment.ewalletDesc')}</p>
                    </div>
                    {selectedPayment === 'ewallet' && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </label>
                </div>
              </motion.div>

              {/* Terms */}
              <motion.div variants={fadeInUp} className="bg-white rounded-lg border border-gray-200 p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-gray-700">
                    {t('checkout.agreeTerms')}
                  </span>
                </label>
              </motion.div>
            </motion.div>

            {/* Right: Order Summary */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="sticky top-4 bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {t('checkout.summary.title')}
                </h2>

                <Separator />

                {/* Items Preview */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}-${item.color.code}`}
                      className="flex gap-3"
                    >
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.color.name} / {item.size} x {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {formatIDR(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Summary Rows */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('checkout.summary.subtotal')}</span>
                    <span>{formatIDR(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>{t('checkout.summary.shipping')}</span>
                    <span>
                      {shippingCost === 0 ? t('checkout.summary.free') : formatIDR(shippingCost)}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {t('checkout.summary.total')}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formatIDR(grandTotal)}
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting || !selectedPayment || !agreeTerms}
                >
                  {isSubmitting ? t('checkout.processing') : t('checkout.placeOrder')}
                </Button>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
