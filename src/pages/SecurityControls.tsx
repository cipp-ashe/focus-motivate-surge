
import React from 'react';
import { SecurityControlsReference } from '@/components/security/SecurityControlsReference';
import { Shield, ShieldCheck } from 'lucide-react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

const SecurityControlsPage: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-4 sm:mb-8 text-center">
        <div className="inline-flex items-center justify-center p-2 sm:p-3 mb-3 sm:mb-4 rounded-full bg-primary/10">
          <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-primary mb-1 sm:mb-2">
          Security Controls
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
          Reference guide to ISO 27001:2022 security controls for enhanced privacy and data protection.
        </p>
      </div>
      
      <div className="card-modern p-2 sm:p-6">
        <SecurityControlsReference />
      </div>
    </div>
  );
};

export default SecurityControlsPage;
