
import React from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import HeroSection from '@/components/landing/HeroSection';
import PrivacySection from '@/components/landing/PrivacySection';
import QuickAccessSection from '@/components/landing/QuickAccessSection';
import BackgroundDecorations from '@/components/landing/BackgroundDecorations';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen relative overflow-hidden py-6 px-4">
      {/* Background decorative elements */}
      <BackgroundDecorations />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Privacy Section */}
        <PrivacySection />
        
        {/* Quick Access Section */}
        <QuickAccessSection />
      </div>
    </div>
  );
};

export default Index;
