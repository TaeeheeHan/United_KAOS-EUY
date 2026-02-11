'use client';

import { motion } from 'framer-motion';
import { Landmark, Leaf, Smartphone, Store } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DiffItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function DifferentiationSection() {
  const { t } = useLanguage();

  const items: DiffItem[] = [
    {
      icon: Landmark,
      title: t('home.differentiation.item1Title'),
      description: t('home.differentiation.item1Description'),
    },
    {
      icon: Store,
      title: t('home.differentiation.item2Title'),
      description: t('home.differentiation.item2Description'),
    },
    {
      icon: Smartphone,
      title: t('home.differentiation.item3Title'),
      description: t('home.differentiation.item3Description'),
    },
    {
      icon: Leaf,
      title: t('home.differentiation.item4Title'),
      description: t('home.differentiation.item4Description'),
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            {t('home.differentiation.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('home.differentiation.subtitle')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
