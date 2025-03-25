
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
    <div className="min-h-screen w-full relative overflow-hidden py-6 px-4 app-background text-foreground transition-colors duration-300">
      {/* Background decorative elements */}
      <BackgroundDecorations />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Two-column layout for Privacy and Quick Access on larger screens */}
        <div className="mt-8 mb-16 flex flex-col lg:flex-row gap-8">
          {/* Privacy Section - takes 1/3 width on larger screens */}
          <div className="lg:w-1/3">
            <PrivacySection />
          </div>
          
          {/* Quick Access Section - takes 2/3 width on larger screens */}
          <div className="lg:w-2/3">
            <QuickAccessSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
