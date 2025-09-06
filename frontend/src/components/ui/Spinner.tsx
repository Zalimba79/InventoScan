import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'current';
  centered?: boolean;
  fullScreen?: boolean;
  label?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  centered = false,
  fullScreen = false,
  label,
  className = ''
}) => {
  const spinnerElement = (
    <div className={`spinner-wrapper ${className}`}>
      <div className={`spinner spinner-${size} spinner-${color}`}>
        <div className="spinner-ring" />
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
      {label && <p className="spinner-label">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        {spinnerElement}
      </div>
    );
  }

  if (centered) {
    return (
      <div className="spinner-container">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

export default Spinner;