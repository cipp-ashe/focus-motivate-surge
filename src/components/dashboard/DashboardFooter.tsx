
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardFooterProps {
  linkTo: string;
  text: string;
}

const DashboardFooter: React.FC<DashboardFooterProps> = ({ linkTo, text }) => {
  return (
    <footer className="mt-12 sm:mt-16 text-center">
      <Button asChild variant="outline" className="bg-card/80 backdrop-blur-sm rounded-full px-6 shadow-glass border-primary/20 hover:bg-primary/10 button-scale">
        <Link to={linkTo} className="flex items-center gap-2">
          {text}
          <ArrowRight className="h-4 w-4 arrow-slide-right" />
        </Link>
      </Button>
    </footer>
  );
};

export default DashboardFooter;
