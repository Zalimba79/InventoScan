import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  action,
  className = '' 
}) => {
  return (
    <div className={`page-header ${className}`}>
      <div className="page-header-content">
        <div className="page-header-text">
          <h1 className="page-title">{title}</h1>
          {description && <p className="page-description">{description}</p>}
        </div>
        {action && (
          <div className="page-header-action">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;