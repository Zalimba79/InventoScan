import React from 'react';
import './PageLayout.css';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`page-layout ${className}`}>
      {children}
    </div>
  );
};

export default PageLayout;