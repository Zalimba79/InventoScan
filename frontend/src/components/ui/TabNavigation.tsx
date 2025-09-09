import React from 'react';
import './TabNavigation.css';

// Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export type ViewMode = 'grid' | 'list';

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showViewToggle?: boolean;
  viewMode?: ViewMode;
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
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  showSearch = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  showViewToggle = false,
  viewMode = 'grid',
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
  onAnalyzeAll
}) => {
  return (
    <div className={`tab-navigation ${className}`}>
      {showSearch && (
        <div className="tab-navigation-search">
          <div className="tab-search-box">
            <SearchIcon />
            <input
              type="text"
              className="tab-search-input"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>
      )}
      {showSelectAll && (
        <div className="tab-navigation-select-all">
          <button
            className={`btn-select-all ${isAllSelected ? 'selected' : ''}`}
            onClick={onSelectAll}
          >
            {isAllSelected ? 'Nichts auswählen' : selectAllLabel}
          </button>
          {selectedCount > 0 && (
            <span className="selection-feedback">
              {selectedCount} von {totalCount} ausgewählt
            </span>
          )}
        </div>
      )}
      <div className="tab-navigation-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-nav-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      {showAnalyzeAll && (
        <div className="tab-navigation-analyze-all">
          <button
            className="analyze-all-btn"
            onClick={onAnalyzeAll}
          >
            Jetzt Analysieren ({isAllSelected ? totalCount : selectedCount})
          </button>
        </div>
      )}
      {showViewToggle && (
        <div className="tab-navigation-view-toggle">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange?.('grid')}
              title="Grid View"
              aria-label="Grid view"
            >
              <GridIcon />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => onViewModeChange?.('list')}
              title="List View"
              aria-label="List view"
            >
              <ListIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabNavigation;