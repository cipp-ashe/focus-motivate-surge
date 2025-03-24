
import React from 'react';

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <header className={`mb-6 ${className}`}>
      {children}
    </header>
  );
};

export default PageHeader;
