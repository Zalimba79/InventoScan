import React from 'react';
import './ProductCard.css';

// Icons
const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const AnalyzeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const DeleteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export interface ProductCardProps {
  id: string;
  code: string;
  imageUrl?: string;
  imageCount?: number;
  date: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onGalleryClick?: (id: string) => void;
  onAnalyzeClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
  showCheckbox?: boolean;
  showQuickActions?: boolean;
}

/**
 * ProductCard - Wiederverwendbare Produktkarten-Komponente
 * Zeigt Produktinformationen mit Bild, Code und Aktionen
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  code,
  imageUrl,
  imageCount = 0,
  date,
  isSelected = false,
  onSelect,
  onGalleryClick,
  onAnalyzeClick,
  onDeleteClick,
  showCheckbox = true,
  showQuickActions = true
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect?.(id);
  };

  const handleCardClick = () => {
    if (!showCheckbox && onSelect) {
      onSelect(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Space oder Enter für Auswahl
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelect?.(id);
    }
    // G für Gallery
    else if (e.key === 'g' || e.key === 'G') {
      e.preventDefault();
      onGalleryClick?.(id);
    }
    // A für Analyze
    else if (e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      onAnalyzeClick?.(id);
    }
    // Delete für Löschen
    else if (e.key === 'Delete') {
      e.preventDefault();
      onDeleteClick?.(id);
    }
  };

  const handleGalleryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGalleryClick?.(id);
  };

  const handleAnalyzeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAnalyzeClick?.(id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick?.(id);
  };

  return (
    <div 
      className={`product-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`Product ${code}`}
      aria-selected={isSelected}
    >
      {/* Hintergrundbild */}
      <div className="card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={code} />
        ) : (
          <div className="card-placeholder">
            <CameraIcon />
          </div>
        )}
      </div>

      {/* Checkbox */}
      {showCheckbox && (
        <div className="card-checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Bildanzahl Badge */}
      {imageCount > 0 && (
        <div className="card-badge">
          {imageCount} {imageCount === 1 ? 'Bild' : 'Bilder'}
        </div>
      )}

      {/* Info Bereich */}
      <div className="card-info">
        <div className="card-code">{code}</div>
        <div className="card-date">{date}</div>
      </div>

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="card-actions">
          {onGalleryClick && (
            <button 
              className="action-btn gallery"
              onClick={handleGalleryClick}
              title="Galerie öffnen"
            >
              <CameraIcon />
            </button>
          )}
          {onAnalyzeClick && (
            <button 
              className="action-btn analyze"
              onClick={handleAnalyzeClick}
              title="Analysieren"
            >
              <AnalyzeIcon />
            </button>
          )}
          {onDeleteClick && (
            <button 
              className="action-btn delete"
              onClick={handleDeleteClick}
              title="Löschen"
            >
              <DeleteIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;