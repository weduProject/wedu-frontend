import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import FeedSection from './components/PopularProposalFeed';
import StatsSection from './components/StatsSection';
import VendorSection from './components/PopularPackages';
import TestimonialSection from './components/TestimonialSection';
import CtaSection from './components/CtaSection';

export default function LandingPage() {
  return (
    <div className="-m-5 min-h-screen bg-white md:-m-8">
      <HeroSection />
      <FeatureSection />
      <FeedSection />
      <StatsSection />
      <VendorSection />
      <TestimonialSection />
      <CtaSection />
    </div>
  );
}