import React from 'react';
import './ContentFooter.css';

interface ContentFooterProps {
  children?: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

/**
 * ContentFooter - Footer-Bereich für Content-Areas
 * Perfekt für Pagination, Actions oder Status-Informationen
 */
export const ContentFooter: React.FC<ContentFooterProps> = ({ 
  children, 
  className = '',
  sticky = false 
}) => {
  return (
    <div className={`content-footer ${sticky ? 'content-footer--sticky' : ''} ${className}`}>
      <div className="content-footer-inner">
        {children}
      </div>
    </div>
  );
};

export default ContentFooter;