
import React from 'react';

export interface TaskLayoutProps {
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
}

export const TaskLayout = ({ mainContent, asideContent }: TaskLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col gap-4 p-4 bg-background">
      <div className="w-full">
        {asideContent}
      </div>
      <div className="w-full">
        {mainContent}
      </div>
    </div>
  );
};
