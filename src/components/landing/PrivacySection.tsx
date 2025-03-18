
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacySection: React.FC = () => {
  return (
    <section className="mb-12 transition-all">
      <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 dark:from-gray-900/60 dark:to-gray-800/30 backdrop-blur-md border border-gray-800/30 rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0 bg-purple-500/20 p-4 rounded-full">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold mb-2 text-white">Your Data is Stored Locally</h3>
            <p className="text-gray-300 mb-4">
              FlowTime saves your data to your browser's local storage. For access across multiple devices, 
              register with a magic link on the settings page.
            </p>
            <Button asChild variant="outline" size="sm" className="rounded-full border-purple-500/20 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200">
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
