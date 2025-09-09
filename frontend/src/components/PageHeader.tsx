import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <div className="page-header">
      <h1 className="page-title">{title}</h1>
      <div className="page-actions">
        {children}
      </div>
    </div>
  );
};