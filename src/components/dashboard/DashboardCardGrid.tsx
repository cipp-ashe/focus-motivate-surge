
import React from 'react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { dashboardCards, iconMap, iconColorMap } from '@/components/dashboard/dashboardData';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { cn } from '@/lib/utils';

const DashboardCardGrid: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={cn(
        "grid gap-4 sm:gap-6 px-2 max-w-7xl mx-auto",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}
      aria-label="Dashboard features"
    >
      {dashboardCards.map((card, index) => (
        <DashboardCard
          key={index}
          to={card.to}
          title={card.title}
          description={card.description}
          icon={iconMap[card.title]}
          iconColor={iconColorMap[card.title]}
          metrics={card.metrics}
        />
      ))}
    </div>
  );
};

export default DashboardCardGrid;
