
import React from 'react';

interface DashboardHeaderProps {
  title: string;
  description: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, description }) => {
  return (
    <header className="text-center mb-10 sm:mb-16">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gradient-primary">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        {description}
      </p>
    </header>
  );
};

export default DashboardHeader;
