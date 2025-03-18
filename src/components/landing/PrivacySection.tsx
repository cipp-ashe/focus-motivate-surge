
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacySection: React.FC = () => {
  return (
    <section className="mb-16">
      <div className="bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900/30 dark:to-transparent border border-gray-100 dark:border-gray-800/30 rounded-xl p-6 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold mb-2">Your Data is Stored Locally</h3>
            <p className="text-muted-foreground mb-4">
              FlowTime saves your data to your browser's local storage. For access across multiple devices, 
              register with a magic link on the settings page.
            </p>
            <Button asChild variant="outline" size="sm" className="rounded-full border-primary/20 hover:bg-primary/10">
              <Link to="/settings">
                Settings <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
