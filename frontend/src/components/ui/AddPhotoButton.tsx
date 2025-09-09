import React, { useRef } from 'react';
import './AddPhotoButton.css';

// Camera Icon
const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

// Plus Icon
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

interface AddPhotoButtonProps {
  onPhotoSelect?: (file: File) => void;
  onPhotoCapture?: () => void;
  variant?: 'primary' | 'secondary' | 'floating';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
  capture?: boolean | 'user' | 'environment';
}

export const AddPhotoButton: React.FC<AddPhotoButtonProps> = ({
  onPhotoSelect,
  onPhotoCapture,
  variant = 'primary',
  size = 'medium',
  showLabel = true,
  label = 'Add Photo',
  accept = 'image/*',
  multiple = false,
  className = '',
  capture = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && onPhotoSelect) {
      if (multiple) {
        Array.from(files).forEach(file => onPhotoSelect(file));
      } else {
        onPhotoSelect(files[0]);
      }
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (capture && onPhotoCapture) {
      onPhotoCapture();
    } else {
      fileInputRef.current?.click();
    }
  };

  const getButtonClass = () => {
    const classes = ['add-photo-button'];
    classes.push(`add-photo-button--${variant}`);
    classes.push(`add-photo-button--${size}`);
    if (!showLabel) classes.push('add-photo-button--icon-only');
    if (className) classes.push(className);
    return classes.join(' ');
  };

  return (
    <>
      <button
        type="button"
        className={getButtonClass()}
        onClick={handleClick}
        aria-label={label}
      >
        <span className="add-photo-button__icon">
          {variant === 'floating' ? <PlusIcon /> : <CameraIcon />}
        </span>
        {showLabel && (
          <span className="add-photo-button__label">{label}</span>
        )}
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="add-photo-button__input"
        aria-hidden="true"
        {...(capture && typeof capture === 'string' ? { capture } : {})}
      />
    </>
  );
};

// Floating Action Button variant
export const AddPhotoFAB: React.FC<Omit<AddPhotoButtonProps, 'variant' | 'showLabel'>> = (props) => {
  return (
    <div className="add-photo-fab-container">
      <AddPhotoButton
        {...props}
        variant="floating"
        showLabel={false}
        size="large"
      />
    </div>
  );
};

export default AddPhotoButton;