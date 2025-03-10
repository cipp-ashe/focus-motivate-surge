
import React from 'react';

export interface TaskLayoutProps {
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
}

export const TaskLayout = ({ mainContent, asideContent }: TaskLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-4 p-4 bg-background">
      <div className="flex-1 min-w-0">
        {mainContent}
      </div>
      <aside className="w-full md:w-96 md:min-w-96 flex-shrink-0">
        {asideContent}
      </aside>
    </div>
  );
};
