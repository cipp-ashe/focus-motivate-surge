
import React from 'react';

export interface TaskLayoutProps {
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
}

export const TaskLayout = ({ mainContent, asideContent }: TaskLayoutProps) => {
  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-card/50 backdrop-blur-sm rounded-lg shadow-sm border border-border/20">
          {asideContent}
        </div>
        <div>
          {mainContent}
        </div>
      </div>
    </div>
  );
};
