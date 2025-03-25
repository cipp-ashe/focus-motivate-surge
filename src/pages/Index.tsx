
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import HeroSection from '@/components/landing/HeroSection';
import PrivacySection from '@/components/landing/PrivacySection';
import QuickAccessSection from '@/components/landing/QuickAccessSection';
import BackgroundDecorations from '@/components/landing/BackgroundDecorations';
import FeaturesSection from '@/components/landing/FeaturesSection';
import { disableRealtime } from '@/lib/supabase/client';
import { logger } from '@/utils/logManager';

const Index = () => {
  const isMobile = useIsMobile();
  
  // Disable realtime on homepage to reduce network traffic
  useEffect(() => {
    logger.debug('Index', 'Homepage loaded, disabling realtime subscriptions');
    disableRealtime();
    
    return () => {
      // Nothing to clean up
    };
  }, []);
  
  return (
    <div className="min-h-screen w-full relative overflow-hidden py-6 px-4 app-background text-foreground transition-colors duration-300">
      {/* Background decorative elements */}
      <BackgroundDecorations />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
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
