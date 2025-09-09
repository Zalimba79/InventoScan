import React from 'react';
import { BasePage } from './BasePage';
import { PageBar } from './PageBar';

interface BaseWithoutNavigationProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

/**
 * BaseWithoutNavigation - Basis-Layout ohne Navigation/Tabs
 * Nutzt BasePage und PageBar für konsistentes Layout
 */
export const BaseWithoutNavigation: React.FC<BaseWithoutNavigationProps> = ({ 
  title,
  subtitle,
  children 
}) => {
  return (
    <BasePage>
      <PageBar 
        title={title} 
        subtitle={subtitle}
      />
      {children}
    </BasePage>
  );
};

export default BaseWithoutNavigation;