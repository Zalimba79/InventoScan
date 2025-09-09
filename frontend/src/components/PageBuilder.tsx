import React, { useState } from 'react';
import { BaseWithTabs, type TabContentData } from './layout';
import './PageBuilder.css';

// Icons for tabs
const OverviewIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="9" x2="15" y2="9"></line>
    <line x1="9" y1="13" x2="15" y2="13"></line>
  </svg>
);

const ComponentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m4.22-13.22l-4.24 4.24M21 12h-6m-6 0H3m13.22 4.22l-4.24-4.24M6.78 6.78l4.24 4.24"></path>
  </svg>
);

/**
 * PageBuilder - Template with BaseWithTabs
 */
export const PageBuilder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const totalItems = 15;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    console.log('Searching for:', value);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    console.log('View mode changed to:', mode);
  };

  const handleSelectAll = () => {
    const newState = !isAllSelected;
    setIsAllSelected(newState);
    setSelectedCount(newState ? totalItems : 0);
    console.log('Select all:', newState);
  };

  const handleAnalyzeSelected = () => {
    console.log(`Analyzing ${selectedCount} selected items`);
  };

  const handleAnalyzeAll = () => {
    console.log(`Analyzing all ${totalItems} items`);
  };

  const handlePhotoSelect = (file: File) => {
    console.log('Photo selected:', file.name);
    // Here you would handle the photo upload
  };

  const tabs: TabContentData[] = [];

  return (
    <BaseWithTabs
      title="PageBuilder"
      subtitle="Page for creating new layouts"
      tabs={tabs}
      showSearch={true}
      searchPlaceholder="Produktcode suchen..."
      onSearchChange={handleSearchChange}
      showViewToggle={true}
      defaultViewMode={viewMode}
      onViewModeChange={handleViewModeChange}
      showSelectAll={true}
      onSelectAll={handleSelectAll}
      selectAllLabel="Alle auswählen"
      isAllSelected={isAllSelected}
      showAnalyzeSelected={false}
      selectedCount={selectedCount}
      onAnalyzeSelected={handleAnalyzeSelected}
      showAnalyzeAll={true}
      totalCount={totalItems}
      onAnalyzeAll={handleAnalyzeAll}
      showAddPhoto={true}
      onPhotoSelect={handlePhotoSelect}
    />
  );
};

export default PageBuilder;