
import React from 'react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { dashboardCards, iconMap, iconColorMap } from '@/components/dashboard/dashboardData';

const DashboardCardGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2">
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
