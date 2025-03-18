
import React from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import HeroSection from '@/components/landing/HeroSection';
import PrivacySection from '@/components/landing/PrivacySection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import QuickAccessSection from '@/components/landing/QuickAccessSection';
import BackgroundDecorations from '@/components/landing/BackgroundDecorations';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <BackgroundDecorations />
      
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Privacy Section */}
        <PrivacySection />
        
        {/* Main Features Section */}
        <FeaturesSection />
        
        {/* Quick Access Section */}
        <QuickAccessSection />
      </div>
    </div>
  );
};

export default Index;
