
import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full py-4 sm:py-8 px-2 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
