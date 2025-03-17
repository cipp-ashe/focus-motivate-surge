
import React from 'react';
import { SecurityControlsReference } from '@/components/security/SecurityControlsReference';
import { Shield, ShieldCheck } from 'lucide-react';

const SecurityControlsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-2">
          Security Controls
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Reference guide to ISO 27001:2022 security controls for enhanced privacy and data protection.
        </p>
      </div>
      
      <div className="card-modern p-6">
        <SecurityControlsReference />
      </div>
    </div>
  );
};

export default SecurityControlsPage;
