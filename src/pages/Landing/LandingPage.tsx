import Footer from '../../components/layout/Footer';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import FeedSection from './components/PopularProposalFeed';
import StatsSection from './components/StatsSection';
import VendorSection from './components/PopularPackages';
import TestimonialSection from './components/TestimonialSection';
import CtaSection from './components/CtaSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeatureSection />
      <FeedSection />
      <StatsSection />
      <VendorSection />
      <TestimonialSection />
      <CtaSection />
      <Footer />
    </div>
  );
}