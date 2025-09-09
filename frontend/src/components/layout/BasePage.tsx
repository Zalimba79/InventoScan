import React from 'react';

/**
 * BasePage - Absolute Basis für alle Seiten
 * Ein transparenter Container der die volle Größe einnimmt
 * Von dieser Komponente können alle anderen Seiten erben
 */
export const BasePage: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ 
      width: '100%', 
      height: 'auto', 
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {children}
    </div>
  );
};

// Alias für Kompatibilität
export const EmptyPage = BasePage;

export default BasePage;