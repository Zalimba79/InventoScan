import React from 'react';
import './LogoPreview.css';

export const LogoPreview: React.FC = () => {
  return (
    <div className="logo-preview-container">
      <div className="logo-preview">
        <img src="/logo.png" alt="InventoScan Logo" />
      </div>
    </div>
  );
};