
import React from 'react';

export interface TaskLayoutProps {
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
}

export const TaskLayout = ({ mainContent, asideContent }: TaskLayoutProps) => {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-card/60 backdrop-blur-sm rounded-xl shadow-lg border border-primary/10 transform transition-all duration-300 hover:shadow-primary/5">
          {asideContent}
        </div>
        <div className="transform transition-all duration-300">
          {mainContent}
        </div>
      </div>
    </div>
  );
};
