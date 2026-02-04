'use client';

import { HeroSection } from '@/components/home/HeroSection';
import { ValuePropositions } from '@/components/home/ValuePropositions';
import { CTABanner } from '@/components/home/CTABanner';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ValuePropositions />
      <CTABanner />
    </div>
  );
}
