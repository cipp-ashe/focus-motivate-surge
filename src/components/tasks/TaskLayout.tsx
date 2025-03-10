
import React from 'react';

export interface TaskLayoutProps {
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
}

export const TaskLayout = ({ mainContent, asideContent }: TaskLayoutProps) => {
  // Debug log to verify component is rendering
  console.log("TaskLayout rendering");
  
  return (
    <div className="min-h-screen w-full bg-background dark:bg-gray-900 py-8 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8 w-full">
        <div className="w-full bg-card/60 dark:bg-card/30 backdrop-blur-sm rounded-xl shadow-lg border border-primary/10 transform transition-all duration-300 hover:shadow-primary/5 max-h-[50vh] overflow-y-auto">
          {asideContent}
        </div>
        <div className="w-full transform transition-all duration-300">
          {mainContent}
        </div>
      </div>
    </div>
  );
};
