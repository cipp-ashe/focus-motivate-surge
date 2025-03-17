
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

interface DashboardHeaderProps {
  title: string;
  description: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, description }) => {
  const isMobile = useIsMobile();
  
  return (
    <header 
      className={cn(
        "text-center",
        isMobile ? "mb-8" : "mb-10 sm:mb-16"
      )}
    >
      <h1 
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gradient-primary"
        id="dashboard-title"
      >
        {title}
      </h1>
      <p 
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        aria-labelledby="dashboard-title"
      >
        {description}
      </p>
    </header>
  );
};

export default DashboardHeader;
