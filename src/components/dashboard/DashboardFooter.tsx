
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { cn } from '@/lib/utils';

interface DashboardFooterProps {
  linkTo: string;
  text: string;
}

const DashboardFooter: React.FC<DashboardFooterProps> = ({ linkTo, text }) => {
  const isMobile = useIsMobile();
  
  return (
    <footer className={cn(
      "text-center",
      isMobile ? "mt-10" : "mt-12 sm:mt-16"
    )}>
      <Button 
        asChild 
        variant="outline" 
        className="bg-card rounded-full px-6"
        aria-label={text}
      >
        <Link to={linkTo} className="flex items-center gap-2">
          {text}
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </Button>
    </footer>
  );
};

export default DashboardFooter;
