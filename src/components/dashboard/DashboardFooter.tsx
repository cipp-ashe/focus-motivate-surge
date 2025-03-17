
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
        className="bg-card/80 backdrop-blur-sm rounded-full px-6 shadow-glass border-primary/20 hover:bg-primary/10 button-scale"
        aria-label={text}
      >
        <Link to={linkTo} className="flex items-center gap-2">
          {text}
          <ArrowRight className="h-4 w-4 arrow-slide-right" aria-hidden="true" />
        </Link>
      </Button>
    </footer>
  );
};

export default DashboardFooter;
