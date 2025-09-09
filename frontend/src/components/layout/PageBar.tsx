import React from 'react';
import { AddPhotoButton } from '../ui';
import './PageBar.css';

interface PageBarProps {
  title: string;
  subtitle?: string;
  className?: string;
  showAddPhoto?: boolean;
  onPhotoSelect?: (file: File) => void;
}

export const PageBar: React.FC<PageBarProps> = ({ 
  title, 
  subtitle,
  className = '',
  showAddPhoto = false,
  onPhotoSelect
}) => {
  return (
    <div className={`page-bar ${className}`}>
      <div className="page-bar-content">
        <div className="page-bar-text">
          <h1 className="page-bar-title">{title}</h1>
          {subtitle && <p className="page-bar-subtitle">{subtitle}</p>}
        </div>
        {showAddPhoto && (
          <div className="page-bar-actions">
            <AddPhotoButton
              onPhotoSelect={onPhotoSelect}
              variant="secondary"
              size="medium"
              label="Add Photo"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageBar;