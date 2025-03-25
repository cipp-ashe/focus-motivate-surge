
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacySection: React.FC = () => {
  return (
    <section className="h-full">
      <div className="border-theme-medium rounded-lg p-6 bg-card/70 backdrop-blur-sm h-full flex flex-col">
        <div className="flex flex-col gap-6 h-full">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Lock className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-semibold">Your Data is Stored Locally</h3>
          </div>
          <div className="flex-1">
            <p className="mb-6 text-muted-foreground">
              FlowTime saves your data to your browser's local storage. For access across multiple devices, 
              register with a magic link on the settings page.
            </p>
          </div>
          <div className="mt-auto">
            <Button asChild variant="purple" size="sm">
              <Link to="/settings" className="flex items-center gap-1">
                Settings <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
