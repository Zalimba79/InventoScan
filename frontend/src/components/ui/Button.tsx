import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    disabled && 'btn-disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-loader">
          <span className="btn-spinner" />
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="btn-icon btn-icon-left">{icon}</span>
          )}
          {children && <span className="btn-text">{children}</span>}
          {icon && iconPosition === 'right' && (
            <span className="btn-icon btn-icon-right">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;