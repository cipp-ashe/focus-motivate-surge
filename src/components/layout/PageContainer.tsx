
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = ""
}) => {
  return (
    <div className={`container mx-auto px-4 py-6 max-w-6xl animate-fade-in ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
