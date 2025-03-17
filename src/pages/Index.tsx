
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardCardGrid from '@/components/dashboard/DashboardCardGrid';
import DashboardFooter from '@/components/dashboard/DashboardFooter';

const IndexPage: React.FC = () => {
  return (
    <DashboardLayout>
      <DashboardHeader 
        title="Focus Dashboard"
        description="Organize your work, improve your productivity, and build better habits"
      />
      
      <main aria-labelledby="dashboard-title">
        <DashboardCardGrid />
      </main>
      
      <DashboardFooter 
        linkTo="/settings"
        text="Start Customizing Your Experience"
      />
    </DashboardLayout>
  );
};

export default IndexPage;
