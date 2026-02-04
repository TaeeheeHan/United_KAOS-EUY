'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, User, Package, Upload } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { FileUpload } from '@/components/common/FileUpload';
import { Separator } from '@/components/common/Separator';
import { fadeInUp } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BulkOrderPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [designFile, setDesignFile] = useState<File | null>(null);

  const bulkOrderSchema = z.object({
    companyName: z.string().min(2, 'Company name is required'),
    contactName: z.string().min(2, t('personalOrder.errors.nameMin')),
    email: z.string().email(t('personalOrder.errors.emailInvalid')),
    phone: z.string().min(10, t('personalOrder.errors.phoneMin')),
    quantity: z.number().min(10, 'Minimum 10 pieces'),
    deadline: z.string().min(1, 'Deadline is required'),
    description: z.string().min(10, t('personalOrder.errors.designMin')),
  });

  type BulkOrderForm = z.infer<typeof bulkOrderSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BulkOrderForm>({
    resolver: zodResolver(bulkOrderSchema),
  });

  const onSubmit = async (data: BulkOrderForm) => {
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      alert(t('personalOrder.successMessage'));
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/custom-order"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>

            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {t('bulkOrder.title')}
              </h1>
              <p className="text-gray-600">
                {t('bulkOrder.subtitle')}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            {/* Company Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                {t('bulkOrder.companyInfo')}
              </h2>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  {t('bulkOrder.fields.companyName')} *
                </label>
                <input
                  type="text"
                  {...register('companyName')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={t('bulkOrder.fields.companyNamePlaceholder')}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Contact Person */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {t('bulkOrder.contactInfo')}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    {t('bulkOrder.fields.contactName')} *
                  </label>
                  <input
                    type="text"
                    {...register('contactName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('bulkOrder.fields.contactNamePlaceholder')}
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactName.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      {t('bulkOrder.fields.email')} *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('bulkOrder.fields.emailPlaceholder')}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      {t('bulkOrder.fields.phone')} *
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('bulkOrder.fields.phonePlaceholder')}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                {t('bulkOrder.orderDetails')}
              </h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      {t('bulkOrder.fields.quantity')} *
                    </label>
                    <input
                      type="number"
                      {...register('quantity', { valueAsNumber: true })}
                      min="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('bulkOrder.fields.quantityPlaceholder')}
                    />
                    {errors.quantity && (
                      <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      {t('bulkOrder.fields.deadline')} *
                    </label>
                    <input
                      type="date"
                      {...register('deadline')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {errors.deadline && (
                      <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    {t('bulkOrder.fields.description')} *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('bulkOrder.fields.descriptionPlaceholder')}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Design Upload */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                {t('fileUpload.title')}
              </h2>

              <FileUpload
                onFileSelect={setDesignFile}
                value={designFile}
                accept="image/png,image/jpeg,application/pdf"
                maxSize={10}
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? t('bulkOrder.submitting') : t('bulkOrder.submitButton')}
              </Button>
              <p className="text-sm text-gray-500 text-center mt-3">
                {t('bulkOrder.footerNote')}
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
