import React from 'react';
import './Loader.css';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  color?: 'primary' | 'white' | 'current';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  fullScreen = false,
  text,
  className = ''
}) => {
  const loaderContent = (
    <div className={`loader loader-${size} loader-${color} ${className}`}>
      {variant === 'spinner' && (
        <div className="loader-spinner" />
      )}
      {variant === 'dots' && (
        <div className="loader-dots">
          <span className="loader-dot" />
          <span className="loader-dot" />
          <span className="loader-dot" />
        </div>
      )}
      {variant === 'pulse' && (
        <div className="loader-pulse" />
      )}
      {variant === 'bars' && (
        <div className="loader-bars">
          <span className="loader-bar" />
          <span className="loader-bar" />
          <span className="loader-bar" />
          <span className="loader-bar" />
        </div>
      )}
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'rect',
  animation = 'pulse',
  className = ''
}) => {
  const style: React.CSSProperties = {};
  
  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }
  
  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <div
      className={`skeleton skeleton-${variant} skeleton-${animation} ${className}`}
      style={style}
    />
  );
};

interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`progress progress-${size} ${className}`}>
      <div className="progress-track">
        <div
          className={`progress-bar progress-bar-${variant}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <span className="progress-label">{Math.round(percentage)}%</span>
      )}
    </div>
  );
};

export default Loader;