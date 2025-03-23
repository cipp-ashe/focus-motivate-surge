
import React from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

export interface TaskLayoutProps {
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
}

export const TaskLayout = ({ mainContent, asideContent }: TaskLayoutProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="min-h-screen w-full py-2 px-2">
        <div className="space-y-4 w-full">
          <div className="w-full rounded-xl max-h-[40vh] overflow-hidden">
            <div className="overflow-x-hidden w-full">
              {asideContent}
            </div>
          </div>
          <div className="w-full pb-20 overflow-hidden">
            {mainContent}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8 w-full">
        <div className="w-full rounded-xl max-h-[50vh] overflow-hidden">
          <div className="overflow-x-hidden w-full">
            {asideContent}
          </div>
        </div>
        <div className="w-full overflow-hidden">
          {mainContent}
        </div>
      </div>
    </div>
  );
};
