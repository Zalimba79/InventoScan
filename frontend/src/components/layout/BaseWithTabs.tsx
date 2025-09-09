import React, { useState } from 'react';
import { BasePage } from './BasePage';
import { PageBar } from './PageBar';
import { TabNavigation, type TabItem, type ViewMode } from '../ui/TabNavigation';
import './BaseWithTabs.css';

export interface TabContentData {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: {
    title: string;
    description: string;
    component?: React.ReactNode;
  };
}

export interface ContentFooterProps {
  children?: React.ReactNode;
  className?: string;
}

interface BaseWithTabsProps {
  title: string;
  subtitle?: string;
  tabs: TabContentData[];
  defaultTab?: string;
  className?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  showViewToggle?: boolean;
  defaultViewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  showSelectAll?: boolean;
  onSelectAll?: () => void;
  selectAllLabel?: string;
  isAllSelected?: boolean;
  showAnalyzeSelected?: boolean;
  selectedCount?: number;
  onAnalyzeSelected?: () => void;
  showAnalyzeAll?: boolean;
  totalCount?: number;
  onAnalyzeAll?: () => void;
  showAddPhoto?: boolean;
  onPhotoSelect?: (file: File) => void;
  children?: React.ReactNode;
}

/**
 * BaseWithTabs - Layout-Komponente für Seiten mit Tab-Navigation
 * Bietet eine konsistente Struktur für alle Seiten mit Tabs
 */
export const BaseWithTabs: React.FC<BaseWithTabsProps> = ({ 
  title,
  subtitle,
  tabs,
  defaultTab,
  className = '',
  showSearch = false,
  searchPlaceholder = 'Search...',
  onSearchChange,
  showViewToggle = false,
  defaultViewMode = 'grid',
  onViewModeChange,
  showSelectAll = false,
  onSelectAll,
  selectAllLabel = 'Alles auswählen',
  isAllSelected = false,
  showAnalyzeSelected = false,
  selectedCount = 0,
  onAnalyzeSelected,
  showAnalyzeAll = false,
  totalCount = 0,
  onAnalyzeAll,
  showAddPhoto = false,
  onPhotoSelect,
  children
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const [searchValue, setSearchValue] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);

  // Convert tabs to TabItem[] for TabNavigation
  const navigationTabs: TabItem[] = tabs.map(({ id, label, icon }) => ({ 
    id, 
    label, 
    icon 
  }));
  
  // Find current tab data
  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    onViewModeChange?.(mode);
  };

  if (!currentTab && tabs.length > 0) {
    return (
      <BasePage>
        <PageBar title={title} subtitle={subtitle} />
        <div className="base-tabs-empty">
          <p>No tabs available</p>
        </div>
      </BasePage>
    );
  }

  return (
    <BasePage>
      <PageBar 
        title={title} 
        subtitle={subtitle} 
        showAddPhoto={showAddPhoto}
        onPhotoSelect={onPhotoSelect}
      />
      
      {tabs.length > 0 && (
        <TabNavigation 
          tabs={navigationTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className={className}
          showSearch={showSearch}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder={searchPlaceholder}
          showViewToggle={showViewToggle}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          showSelectAll={showSelectAll}
          onSelectAll={onSelectAll}
          selectAllLabel={selectAllLabel}
          isAllSelected={isAllSelected}
          showAnalyzeSelected={showAnalyzeSelected}
          selectedCount={selectedCount}
          onAnalyzeSelected={onAnalyzeSelected}
          showAnalyzeAll={showAnalyzeAll}
          totalCount={totalCount}
          onAnalyzeAll={onAnalyzeAll}
        />
      )}
      
      {tabs.length === 0 && (showSearch || showSelectAll || showAnalyzeSelected || showAnalyzeAll) && (
        <TabNavigation 
          tabs={[]}
          activeTab=""
          onTabChange={() => {}}
          className={className}
          showSearch={showSearch}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder={searchPlaceholder}
          showViewToggle={showViewToggle}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          showSelectAll={showSelectAll}
          onSelectAll={onSelectAll}
          selectAllLabel={selectAllLabel}
          isAllSelected={isAllSelected}
          showAnalyzeSelected={showAnalyzeSelected}
          selectedCount={selectedCount}
          onAnalyzeSelected={onAnalyzeSelected}
          showAnalyzeAll={showAnalyzeAll}
          totalCount={totalCount}
          onAnalyzeAll={onAnalyzeAll}
        />
      )}
      
      {currentTab && (
        <div className="base-tabs-content">
          <div className="base-tabs-header">
            <h2 className="base-tabs-title">
              {currentTab.content.title}
            </h2>
            <p className="base-tabs-description">
              {currentTab.content.description}
            </p>
          </div>
          {currentTab.content.component && (
            <div className="base-tabs-scroll-area">
              {currentTab.content.component}
            </div>
          )}
        </div>
      )}
      
      {!currentTab && tabs.length === 0 && children && (
        <div className="base-tabs-content">
          <div className="base-tabs-scroll-area">
            {children}
          </div>
        </div>
      )}
    </BasePage>
  );
};

export default BaseWithTabs;