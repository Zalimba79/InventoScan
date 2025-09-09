import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { BaseWithTabs, type TabContentData } from './layout';
import { AddPhotoButton, ProductCard } from './ui';
import { sanitizeInput, createSafeHtml, createSafeImageProps } from '../utils/security';
import './ProductDrafts.css';

// Icons
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

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

interface ProductDraft {
  id: string;
  date: Date;
  productCode: string;
  thumbnail: string;
  images: string[];
  imageCount: number;
  status: 'incomplete' | 'pending' | 'analyzed';
}

interface ProductDraftsProps {
  onNavigateToUpload?: () => void;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export const ProductDrafts: React.FC<ProductDraftsProps> = ({ onNavigateToUpload }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDraft, setSelectedDraft] = useState<ProductDraft | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set());
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [editingDraft, setEditingDraft] = useState<ProductDraft | null>(null);
  const [showEditGallery, setShowEditGallery] = useState(false);
  const [visibleItems, setVisibleItems] = useState(20); // Start with 20 items
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Mock data - mit useMemo für konsistente Daten
  const initialDrafts = useMemo(() => 
    Array.from({ length: 75 }, (_, i) => {
      // Erstes Produkt (001) und 40. Produkt (040) bekommen 10 Bilder, Rest zufällig
      // Verwendung eines festen Seeds für konsistente Zufallszahlen
      const seed = i * 1337; // Fester Seed pro Produkt
      const random = () => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };
      
      const numImages = (i === 0 || i === 39) ? 10 : Math.floor(random() * 4) + 1;
      const images = Array.from({ length: numImages }, (_, j) => 
        `https://picsum.photos/seed/${i}-${j}/600/400`  // Seed für konsistente Bilder
      );
      
      return {
        id: String(i + 1),
        date: new Date(2024, 0, (i % 30) + 1), // Deterministisches Datum
        productCode: `PROD-2024-${String(i + 1).padStart(3, '0')}`,
        thumbnail: `https://picsum.photos/seed/${i}/200/200`, // Seed für konsistentes Thumbnail
        images: images,
        imageCount: images.length, // imageCount = tatsächliche Anzahl der Bilder
        status: i % 10 > 7 ? 'analyzed' : i % 10 > 5 ? 'pending' : 'incomplete' as 'incomplete' | 'pending' | 'analyzed'
      };
    })
  , []); // Leere Dependencies = wird nur einmal berechnet

  const [drafts, setDrafts] = useState<ProductDraft[]>(initialDrafts);

  const unanalyzedDrafts = drafts.filter(draft => draft.status !== 'analyzed');

  const handleSelectDraft = (draftId: string) => {
    const newSelected = new Set(selectedDrafts);
    if (newSelected.has(draftId)) {
      newSelected.delete(draftId);
    } else {
      newSelected.add(draftId);
    }
    setSelectedDrafts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDrafts.size === unanalyzedDrafts.length) {
      setSelectedDrafts(new Set());
    } else {
      setSelectedDrafts(new Set(unanalyzedDrafts.map(d => d.id)));
    }
  };

  // Keyboard Navigation - NACH handleSelectAll Definition
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape schließt alle Modals
      if (e.key === 'Escape') {
        setShowEditGallery(false);
        setShowAnalyzeModal(false);
        setSelectedDraft(null);
      }
      // Ctrl/Cmd + A für Alle auswählen
      else if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        handleSelectAll();
      }
      // Delete für ausgewählte Produkte löschen
      else if (e.key === 'Delete' && selectedDrafts.size > 0 && !showEditGallery && !showAnalyzeModal) {
        if (window.confirm(`Möchten Sie ${selectedDrafts.size} Produkte löschen?`)) {
          setDrafts(prevDrafts => 
            prevDrafts.filter(d => !selectedDrafts.has(d.id))
          );
          setSelectedDrafts(new Set());
        }
      }
      // Arrow Keys für Navigation in Gallery
      else if (showEditGallery && editingDraft) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          // Navigation innerhalb der Gallery-Bilder
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDrafts, showEditGallery, showAnalyzeModal, editingDraft, unanalyzedDrafts]);

  const handleAnalyze = () => {
    if (selectedDrafts.size > 0) {
      setShowAnalyzeModal(true);
    }
  };

  const handleStartAnalysis = () => {
    console.log('Analyzing drafts:', Array.from(selectedDrafts));
    setShowAnalyzeModal(false);
    setSelectedDrafts(new Set());
  };

  const handleNewProduct = (file?: File) => {
    if (file) {
      console.log('New product from file:', file.name);
    } else if (onNavigateToUpload) {
      onNavigateToUpload();
    } else {
      console.log('Navigate to product creation');
    }
  };

  const handleSearchChange = (value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setSearchTerm(sanitizedValue);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    console.log('Switching view mode to:', mode);
    setViewMode(mode);
  };

  // Filter and search
  const filteredDrafts = unanalyzedDrafts.filter(draft => {
    const productCode = draft.productCode.toLowerCase();
    const sanitizedSearchTerm = sanitizeInput(searchTerm).toLowerCase();
    return productCode.includes(sanitizedSearchTerm);
  });

  // Sort
  const sortedDrafts = [...filteredDrafts].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Lazy loading - show only visible items
  const displayedDrafts = sortedDrafts.slice(0, visibleItems);
  const hasMore = visibleItems < sortedDrafts.length;

  // Load more function
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      // Simulate loading delay
      setTimeout(() => {
        setVisibleItems(prev => Math.min(prev + 20, sortedDrafts.length));
        setIsLoading(false);
      }, 300);
    }
  }, [hasMore, isLoading, sortedDrafts.length]);

  // Setup Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, isLoading]);

  // Reset visible items when search changes
  useEffect(() => {
    setVisibleItems(20);
  }, [searchTerm]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedDraft) {
      setCurrentImageIndex((prev) => 
        prev < selectedDraft.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedDraft) {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedDraft.images.length - 1
      );
    }
  };

  // Check if we should use virtualization (20+ items für bessere Performance)
  const shouldVirtualize = sortedDrafts.length > 20;

  // Tab content with cards
  const renderDraftsContent = () => {
    console.log('Current view mode:', viewMode, 'Drafts count:', unanalyzedDrafts.length);
    return (
    <div className="drafts-container">
      {unanalyzedDrafts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <CheckIcon />
            </div>
            <h2>Keine Entwürfe zur Analyse vorhanden</h2>
            <p>Alle Produktentwürfe wurden bereits analysiert.</p>
            <AddPhotoButton
              onPhotoSelect={handleNewProduct}
              variant="primary"
              size="large"
              label="Neues Produkt erfassen"
            />
          </div>
        ) : viewMode === 'list' ? (
          <table className="drafts-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input 
                    type="checkbox"
                    checked={selectedDrafts.size === unanalyzedDrafts.length && unanalyzedDrafts.length > 0}
                    onChange={handleSelectAll}
                    style={{ display: 'block', width: '18px', height: '18px' }}
                  />
                </th>
                <th>Bild</th>
                <th>Produktcode</th>
                <th>Datum</th>
                <th>Bilder</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDrafts.map(draft => (
                <tr key={draft.id}>
                  <td className="checkbox-column">
                    <input 
                      type="checkbox"
                      checked={selectedDrafts.has(draft.id)}
                      onChange={() => handleSelectDraft(draft.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: 'block', width: '18px', height: '18px' }}
                    />
                  </td>
                  <td className="thumbnail-cell">
                    <div className="table-thumbnail" onClick={() => { setSelectedDraft(draft); setCurrentImageIndex(0); }}>
                      <img {...createSafeImageProps(draft.thumbnail, draft.productCode)} />
                    </div>
                  </td>
                  <td className="code-cell" dangerouslySetInnerHTML={createSafeHtml(draft.productCode)} />
                  <td className="date-cell">{formatDate(draft.date)}</td>
                  <td className="count-cell">{draft.imageCount} Bilder</td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn edit"
                      onClick={() => { 
                        setEditingDraft(draft);
                        setShowEditGallery(true);
                      }}
                      title="Bearbeiten"
                    >
                      <EditIcon />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => { 
                        if (window.confirm(`Möchten Sie das Produkt ${draft.productCode} löschen?`)) {
                          setDrafts(prevDrafts => prevDrafts.filter(d => d.id !== draft.id));
                        }
                      }}
                      title="Löschen"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Grid view for cards
          <>
            <div className={`drafts-grid ${shouldVirtualize ? 'virtualized' : ''}`}>
              {displayedDrafts.map(draft => (
                <ProductCard
                  key={draft.id}
                  id={draft.id}
                  code={draft.productCode}
                  imageUrl={draft.thumbnail}
                  imageCount={draft.imageCount}
                  date={formatDate(draft.date)}
                  isSelected={selectedDrafts.has(draft.id)}
                  onSelect={handleSelectDraft}
                  onGalleryClick={(id) => {
                    const d = drafts.find(dr => dr.id === id);
                    if (d) {
                      setEditingDraft(d);
                      setShowEditGallery(true);
                    }
                  }}
                  onAnalyzeClick={(id) => {
                    const d = drafts.find(dr => dr.id === id);
                    if (d) {
                      // Hier könnte die Analyse-Funktion hin
                      console.log('Analyzing product:', d.productCode);
                      setShowAnalyzeModal(true);
                    }
                  }}
                  onDeleteClick={(id) => {
                    const d = drafts.find(dr => dr.id === id);
                    if (d && window.confirm(`Möchten Sie das Produkt ${d.productCode} löschen?`)) {
                      setDrafts(prevDrafts => prevDrafts.filter(dr => dr.id !== id));
                    }
                  }}
                />
              ))}
            </div>
            
            {/* Lazy Loading Trigger */}
            {hasMore && (
              <div 
                ref={loadMoreRef}
                className="lazy-load-trigger"
                style={{ 
                  padding: '20px', 
                  textAlign: 'center',
                  color: 'var(--text-secondary)'
                }}
              >
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Lade weitere Produkte...</span>
                  </div>
                ) : (
                  <span style={{ opacity: 0.5 }}>Scroll für mehr</span>
                )}
              </div>
            )}
            
            {!hasMore && displayedDrafts.length > 0 && (
              <div className="end-of-list" style={{ 
                padding: '20px', 
                textAlign: 'center',
                color: 'var(--text-tertiary)',
                fontSize: 'var(--text-sm)'
              }}>
                Alle {displayedDrafts.length} Produkte geladen
              </div>
            )}
          </>
        )}
    </div>
  );
  };

  // Create tabs with content - no tabs, just toolbar
  const tabs: TabContentData[] = [];

  return (
    <>
      <BaseWithTabs
        title="Produktentwürfe"
        subtitle="Wählen Sie Entwürfe aus und starten Sie die Produktanalyse"
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
        isAllSelected={selectedDrafts.size === unanalyzedDrafts.length}
        showAnalyzeSelected={false}
        selectedCount={selectedDrafts.size}
        onAnalyzeSelected={handleAnalyze}
        showAnalyzeAll={true}
        totalCount={sortedDrafts.length} // Immer die Gesamtzahl aller gefilterten Produkte
        onAnalyzeAll={handleAnalyze}
        showAddPhoto={true}
        onPhotoSelect={handleNewProduct}
      >
        {renderDraftsContent()}
      </BaseWithTabs>

      {/* Edit Gallery Modal */}
      {showEditGallery && editingDraft && (
        <div className="modal-overlay" onClick={() => setShowEditGallery(false)}>
          <div className="edit-gallery-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gallery-header">
              <h2>Bilder bearbeiten - <span dangerouslySetInnerHTML={createSafeHtml(editingDraft.productCode)} /></h2>
              <button className="close-btn" onClick={() => setShowEditGallery(false)}>
                ×
              </button>
            </div>
            
            <div className="gallery-grid">
              {editingDraft.images.map((image, index) => (
                <div key={index} className="gallery-item">
                  <img {...createSafeImageProps(image, `Bild ${index + 1}`)} />
                  <button 
                    className="remove-image-btn"
                    onClick={() => {
                      const updatedDrafts = drafts.map(d => {
                        if (d.id === editingDraft.id) {
                          const newImages = d.images.filter((_, i) => i !== index);
                          return {
                            ...d,
                            images: newImages,
                            imageCount: newImages.length
                          };
                        }
                        return d;
                      });
                      setDrafts(updatedDrafts);
                      const updatedEditingDraft = {
                        ...editingDraft,
                        images: editingDraft.images.filter((_, i) => i !== index),
                        imageCount: editingDraft.imageCount - 1
                      };
                      setEditingDraft(updatedEditingDraft);
                      
                      if (updatedEditingDraft.images.length === 0) {
                        setShowEditGallery(false);
                      }
                    }}
                    title="Bild entfernen"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="gallery-footer">
              <p>{editingDraft.images.length} Bild{editingDraft.images.length !== 1 ? 'er' : ''}</p>
              <button className="btn-confirm" onClick={() => setShowEditGallery(false)}>
                Fertig
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image View Modal */}
      {selectedDraft && (
        <div className="gallery-modal" onClick={() => setSelectedDraft(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDraft(null)}>
              <CloseIcon />
            </button>
            
            <div className="gallery-container">
              {selectedDraft.images.length > 1 && (
                <button className="gallery-nav prev" onClick={prevImage}>
                  <ChevronLeftIcon />
                </button>
              )}
              
              <img 
                {...createSafeImageProps(
                  selectedDraft.images[currentImageIndex],
                  `${selectedDraft.productCode} - Bild ${currentImageIndex + 1}`
                )}
                className="gallery-image"
              />
              
              {selectedDraft.images.length > 1 && (
                <button className="gallery-nav next" onClick={nextImage}>
                  <ChevronRightIcon />
                </button>
              )}
            </div>
            
            <div className="gallery-info">
              <h3 dangerouslySetInnerHTML={createSafeHtml(selectedDraft.productCode)} />
              <p>Bild {currentImageIndex + 1} von {selectedDraft.images.length}</p>
            </div>
            
            {selectedDraft.images.length > 1 && (
              <div className="gallery-dots">
                {selectedDraft.images.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analyze Configuration Modal */}
      {showAnalyzeModal && (
        <div className="analyze-modal" onClick={() => setShowAnalyzeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAnalyzeModal(false)}>
              <CloseIcon />
            </button>
            
            <h2>Analyse konfigurieren</h2>
            <p className="modal-subtitle">
              {selectedDrafts.size} {selectedDrafts.size === 1 ? 'Entwurf' : 'Entwürfe'} zur Analyse ausgewählt
            </p>

            <div className="analyze-options">
              <div className="option-group">
                <h3>Analysetyp</h3>
                <label>
                  <input type="radio" name="analysis-type" defaultChecked />
                  <span>Vollständige Analyse (AI + Barcode)</span>
                </label>
                <label>
                  <input type="radio" name="analysis-type" />
                  <span>Nur AI-Texterkennung</span>
                </label>
                <label>
                  <input type="radio" name="analysis-type" />
                  <span>Nur Barcode-Scan</span>
                </label>
              </div>

              <div className="option-group">
                <h3>Kategorisierung</h3>
                <label>
                  <input type="checkbox" defaultChecked />
                  <span>Automatische Kategoriezuweisung</span>
                </label>
                <label>
                  <input type="checkbox" defaultChecked />
                  <span>Preisschätzung durchführen</span>
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowAnalyzeModal(false)}>
                Abbrechen
              </button>
              <button className="btn-primary" onClick={handleStartAnalysis}>
                Analyse starten
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDrafts;