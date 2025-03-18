
import React from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import HeroSection from '@/components/landing/HeroSection';
import PrivacySection from '@/components/landing/PrivacySection';
import QuickAccessSection from '@/components/landing/QuickAccessSection';
import BackgroundDecorations from '@/components/landing/BackgroundDecorations';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Background decorative elements */}
      <BackgroundDecorations />
      
      <div className="max-w-7xl mx-auto">
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
