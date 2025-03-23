
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacySection: React.FC = () => {
  return (
    <section className="mt-8 mb-8">
      <div className="border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            <Lock className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold mb-2">Your Data is Stored Locally</h3>
            <p className="mb-4">
              FlowTime saves your data to your browser's local storage. For access across multiple devices, 
              register with a magic link on the settings page.
            </p>
            <Button asChild variant="outline" size="sm">
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
