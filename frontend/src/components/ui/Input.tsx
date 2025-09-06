import React, { forwardRef } from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  variant = 'default',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const wrapperClasses = [
    'input-wrapper',
    fullWidth && 'input-wrapper-full',
    error && 'input-wrapper-error',
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'input',
    `input-${variant}`,
    icon && iconPosition === 'left' && 'input-with-icon-left',
    icon && iconPosition === 'right' && 'input-with-icon-right',
    error && 'input-error'
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="input-container">
        {icon && iconPosition === 'left' && (
          <span className="input-icon input-icon-left">{icon}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="input-icon input-icon-right">{icon}</span>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className="input-error-text">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${inputId}-helper`} className="input-helper-text">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  variant = 'default',
  resize = 'vertical',
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const wrapperClasses = [
    'input-wrapper',
    fullWidth && 'input-wrapper-full',
    error && 'input-wrapper-error',
    className
  ].filter(Boolean).join(' ');

  const textareaClasses = [
    'input',
    'textarea',
    `input-${variant}`,
    `textarea-resize-${resize}`,
    error && 'input-error'
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={textareaId} className="input-label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={textareaClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        {...props}
      />
      {error && (
        <span id={`${textareaId}-error`} className="input-error-text">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${textareaId}-helper`} className="input-helper-text">
          {helperText}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;