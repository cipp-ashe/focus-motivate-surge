
import React from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import HeroSection from '@/components/landing/HeroSection';
import PrivacySection from '@/components/landing/PrivacySection';
import QuickAccessSection from '@/components/landing/QuickAccessSection';
import BackgroundDecorations from '@/components/landing/BackgroundDecorations';
import FeaturesSection from '@/components/landing/FeaturesSection';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full relative overflow-hidden py-6 px-4 bg-background text-foreground transition-colors duration-300">
      {/* Background decorative elements */}
      <BackgroundDecorations />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section - Add our new component */}
        <FeaturesSection />
        
        {/* Privacy Section */}
        <PrivacySection />
        
        {/* Quick Access Section */}
        <QuickAccessSection />
      </div>
    </div>
  );
};

export default Index;
