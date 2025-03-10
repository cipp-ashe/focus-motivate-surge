
import React from 'react';

export interface TaskLayoutProps {
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
}

export const TaskLayout = ({ mainContent, asideContent }: TaskLayoutProps) => {
  return (
    <div className="flex flex-col md:flex-row h-full max-h-full overflow-hidden">
      <div className="flex-1 overflow-auto p-4">
        {mainContent}
      </div>
      <aside className="md:w-96 h-full overflow-auto border-l border-border">
        {asideContent}
      </aside>
    </div>
  );
};
