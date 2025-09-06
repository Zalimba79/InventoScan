import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  dot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  pill = false,
  dot = false,
  className = ''
}) => {
  const badgeClasses = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    pill && 'badge-pill',
    dot && 'badge-with-dot',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
};

interface BadgeGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`badge-group ${className}`}>
      {children}
    </div>
  );
};

export default Badge;