import React from 'react';
import './PageContent.css';

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const PageContent: React.FC<PageContentProps> = ({ 
  children, 
  className = '',
  noPadding = false
}) => {
  return (
    <div className={`page-content ${noPadding ? 'page-content--no-padding' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default PageContent;