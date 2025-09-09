import React from 'react';
import './PageToolbar.css';

interface PageToolbarProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'tabs' | 'filters';
}

export const PageToolbar: React.FC<PageToolbarProps> = ({ 
  children, 
  className = '',
  variant = 'default'
}) => {
  return (
    <div className={`page-toolbar page-toolbar--${variant} ${className}`}>
      {children}
    </div>
  );
};

export default PageToolbar;