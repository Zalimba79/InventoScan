import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  size = 'md',
  className = ''
}) => {
  const defaultIcon = (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="8" y="12" width="48" height="40" rx="4" />
      <path d="M8 20 L32 36 L56 20" />
      <circle cx="20" cy="40" r="4" />
      <line x1="30" y1="40" x2="44" y2="40" />
    </svg>
  );

  return (
    <div className={`empty-state empty-state-${size} ${className}`}>
      <div className="empty-state-icon">
        {icon || defaultIcon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {action && (
        <div className="empty-state-action">{action}</div>
      )}
    </div>
  );
};

export default EmptyState;