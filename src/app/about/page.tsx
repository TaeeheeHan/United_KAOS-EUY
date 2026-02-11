'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import {
  BadgeCheck,
  Compass,
  Eye,
  Goal,
  Leaf,
  MessageSquareText,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useLanguage } from '@/contexts/LanguageContext';

type CardProps = {
  title: string;
  body: string;
  icon: ComponentType<{ className?: string }>;
};

function StrategyCard({ title, body, icon: Icon }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-gray-200 bg-white p-6"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{body}</p>
    </motion.div>
  );
}

export default function AboutPage() {
  const { t } = useLanguage();

  const missionItems = [
    t('about.mission.item1'),
    t('about.mission.item2'),
    t('about.mission.item3'),
    t('about.mission.item4'),
  ];

  const demographicItems = [
    t('about.targetMarket.demographic1'),
    t('about.targetMarket.demographic2'),
    t('about.targetMarket.demographic3'),
  ];

  const psychographicItems = [
    t('about.targetMarket.psychographic1'),
    t('about.targetMarket.psychographic2'),
    t('about.targetMarket.psychographic3'),
  ];

  const personalityItems = [
    {
      title: t('about.personality.item1Title'),
      body: t('about.personality.item1Body'),
    },
    {
      title: t('about.personality.item2Title'),
      body: t('about.personality.item2Body'),
    },
    {
      title: t('about.personality.item3Title'),
      body: t('about.personality.item3Body'),
    },
    {
      title: t('about.personality.item4Title'),
      body: t('about.personality.item4Body'),
    },
  ];

  const valueItems = [
    {
      title: t('about.coreValues.item1Title'),
      body: t('about.coreValues.item1Body'),
    },
    {
      title: t('about.coreValues.item2Title'),
      body: t('about.coreValues.item2Body'),
    },
    {
      title: t('about.coreValues.item3Title'),
      body: t('about.coreValues.item3Body'),
    },
    {
      title: t('about.coreValues.item4Title'),
      body: t('about.coreValues.item4Body'),
    },
  ];

  const differentiationItems = [
    t('about.differentiation.item1'),
    t('about.differentiation.item2'),
    t('about.differentiation.item3'),
    t('about.differentiation.item4'),
  ];

  const longTermItems = [
    t('about.longTermGoal.item1'),
    t('about.longTermGoal.item2'),
    t('about.longTermGoal.item3'),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{t('about.subtitle')}</p>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary font-semibold">
            <span>{t('about.positioning.taglineLabel')}:</span>
            <span>{t('brand.tagline')}</span>
          </div>
        </motion.div>

        <section className="grid md:grid-cols-3 gap-6">
          <StrategyCard
            icon={Target}
            title={t('about.purpose.title')}
            body={t('about.purpose.body')}
          />
          <StrategyCard
            icon={Eye}
            title={t('about.vision.title')}
            body={t('about.vision.body')}
          />
          <StrategyCard
            icon={Compass}
            title={t('about.positioning.title')}
            body={t('about.positioning.body')}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{t('about.addedContext.title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <StrategyCard
              icon={Sparkles}
              title={t('about.addedContext.kaosTitle')}
              body={t('about.addedContext.kaosBody')}
            />
            <StrategyCard
              icon={Sparkles}
              title={t('about.addedContext.euyTitle')}
              body={t('about.addedContext.euyBody')}
            />
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.mission.title')}</h2>
            <ul className="space-y-3 text-gray-700">
              {missionItems.map((item, idx) => (
                <li key={`mission-${idx}`} className="flex items-start gap-3">
                  <BadgeCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.targetMarket.title')}</h2>
            <div className="space-y-5">
              <div>
                <p className="font-semibold text-gray-900 mb-2">{t('about.targetMarket.demographicTitle')}</p>
                <ul className="space-y-2 text-gray-700">
                  {demographicItems.map((item, idx) => (
                    <li key={`demo-${idx}`} className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">{t('about.targetMarket.psychographicTitle')}</p>
                <ul className="space-y-2 text-gray-700">
                  {psychographicItems.map((item, idx) => (
                    <li key={`psy-${idx}`} className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.personality.title')}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {personalityItems.map((item, idx) => (
                <div key={`personality-${idx}`} className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.coreValues.title')}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {valueItems.map((item, idx) => (
                <div key={`value-${idx}`} className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-5">{t('about.messageStrategy.title')}</h2>
            <div className="space-y-5">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-semibold text-primary mb-1">{t('about.messageStrategy.mainLabel')}</p>
                <p className="text-gray-700">{t('about.messageStrategy.mainBody')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-primary mb-2">{t('about.messageStrategy.emotionalLabel')}</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <MessageSquareText className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                      <span>{t('about.messageStrategy.emotional1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <MessageSquareText className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                      <span>{t('about.messageStrategy.emotional2')}</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-primary mb-2">{t('about.messageStrategy.functionalLabel')}</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <BadgeCheck className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                      <span>{t('about.messageStrategy.functional1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BadgeCheck className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                      <span>{t('about.messageStrategy.functional2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BadgeCheck className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                      <span>{t('about.messageStrategy.functional3')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.differentiation.title')}</h2>
            <ul className="space-y-3 text-gray-700">
              {differentiationItems.map((item, idx) => (
                <li key={`diff-${idx}`} className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.longTermGoal.title')}</h2>
            <ul className="space-y-3 text-gray-700">
              {longTermItems.map((item, idx) => (
                <li key={`long-${idx}`} className="flex items-start gap-3">
                  <Goal className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-secondary mb-4">{t('about.cta.title')}</h3>
          <Link href="/products">
            <Button size="lg">{t('about.cta.button')}</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
