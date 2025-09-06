import React from 'react';
import './MobileNav.css';

interface MobileNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'catalog', icon: '📦', label: 'Katalog' },
    { id: 'mobile', icon: '📸', label: 'Erfassen' },
    { id: 'upload', icon: '⬆️', label: 'Upload' },
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-item ${currentView === item.id ? 'active' : ''}`}
          onClick={() => onViewChange(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};