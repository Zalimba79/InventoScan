import React from 'react';
import './ProductToolbar.css';

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

export type ViewMode = 'grid' | 'list';

interface ProductToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  isAllSelected?: boolean;
  onSelectAll?: () => void;
  selectedCount?: number;
  totalCount?: number;
  onAnalyze?: () => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  className?: string;
}

export const ProductToolbar: React.FC<ProductToolbarProps> = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Produktcode suchen...',
  isAllSelected = false,
  onSelectAll,
  selectedCount = 0,
  totalCount = 0,
  onAnalyze,
  viewMode = 'grid',
  onViewModeChange,
  className = ''
}) => {
  return (
    <div className={`product-toolbar ${className}`}>
      <div className="product-toolbar-search">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            className="search-input"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      </div>
      
      <div className="product-toolbar-select">
        <button
          className={`select-all-btn ${isAllSelected ? 'selected' : ''}`}
          onClick={onSelectAll}
        >
          {isAllSelected ? 'Nichts auswählen' : 'Alle auswählen'}
        </button>
      </div>
      
      <div className="product-toolbar-analyze">
        <button
          className="analyze-btn"
          onClick={onAnalyze}
        >
          Jetzt Analysieren ({isAllSelected ? totalCount : selectedCount})
        </button>
      </div>
      
      <div className="product-toolbar-spacer"></div>
      
      <div className="product-toolbar-view">
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
    </div>
  );
};

export default ProductToolbar;