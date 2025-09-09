import React, { useState, useEffect, useRef } from 'react';
import './FlexibleDashboard.css';

// Icons
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DragIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="5" r="1" fill="currentColor" />
    <circle cx="15" cy="5" r="1" fill="currentColor" />
    <circle cx="9" cy="12" r="1" fill="currentColor" />
    <circle cx="15" cy="12" r="1" fill="currentColor" />
    <circle cx="9" cy="19" r="1" fill="currentColor" />
    <circle cx="15" cy="19" r="1" fill="currentColor" />
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// Card Size Options
const CARD_SIZES = {
  xs: { label: 'XS', className: 'card-xs' },
  sm: { label: 'SM', className: 'card-sm' },
  md: { label: 'MD', className: 'card-md' },
  lg: { label: 'LG', className: 'card-lg' },
  xl: { label: 'XL', className: 'card-xl' },
  '2xl': { label: '2XL', className: 'card-2xl' },
  full: { label: 'FULL', className: 'card-full' }
};

// Card Span Options
const CARD_SPANS = {
  1: { label: '1 Column', className: 'card-span-1' },
  2: { label: '2 Columns', className: 'card-span-2' },
  3: { label: '3 Columns', className: 'card-span-3' },
  4: { label: '4 Columns', className: 'card-span-4' },
  full: { label: 'Full Width', className: 'card-span-full' }
};

interface CardConfig {
  id: string;
  title: string;
  type: string;
  size: keyof typeof CARD_SIZES;
  span: keyof typeof CARD_SPANS;
  visible: boolean;
  position: number;
  icon: React.ReactNode;
  content?: React.ReactNode;
}

interface FlexibleDashboardProps {
  onEditModeChange?: (editMode: boolean) => void;
}

export const FlexibleDashboard: React.FC<FlexibleDashboardProps> = ({ onEditModeChange }) => {
  const [editMode, setEditMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardConfig | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [cards, setCards] = useState<CardConfig[]>([
    {
      id: 'value-overview',
      title: 'Wert-Übersicht',
      type: 'value',
      size: 'sm',
      span: 1,
      visible: true,
      position: 0,
      icon: <ChartIcon />,
      content: (
        <div className="value-metrics">
          <div className="value-main">
            <span className="value-amount">€ 24.850</span>
            <span className="value-label">Gesamtwert</span>
          </div>
        </div>
      )
    },
    {
      id: 'daily-capture',
      title: 'Heutige Erfassung',
      type: 'metrics',
      size: 'md',
      span: 2,
      visible: true,
      position: 1,
      icon: <ChartIcon />,
      content: (
        <div className="metrics-preview">
          <div className="metric-item">
            <span className="metric-value">47</span>
            <span className="metric-label">Artikel</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">142</span>
            <span className="metric-label">Fotos</span>
          </div>
        </div>
      )
    },
    {
      id: 'recent-scans',
      title: 'Letzte Scans',
      type: 'list',
      size: 'lg',
      span: 2,
      visible: true,
      position: 2,
      icon: <ClipboardIcon />,
      content: (
        <div className="scans-preview">
          <div className="scan-item-preview">MacBook Pro 16"</div>
          <div className="scan-item-preview">Herman Miller Aeron</div>
          <div className="scan-item-preview">iPhone 15 Pro</div>
        </div>
      )
    },
    {
      id: 'categories',
      title: 'Kategorien-Übersicht',
      type: 'categories',
      size: 'md',
      span: 1,
      visible: true,
      position: 3,
      icon: <FolderIcon />,
      content: (
        <div className="categories-preview">
          <div className="category-preview">Elektronik: 45</div>
          <div className="category-preview">Bücher: 67</div>
          <div className="category-preview">Möbel: 23</div>
        </div>
      )
    },
    {
      id: 'activity',
      title: 'Scan-Aktivität',
      type: 'chart',
      size: 'md',
      span: 2,
      visible: true,
      position: 4,
      icon: <ChartIcon />,
      content: (
        <div className="chart-preview">
          <svg viewBox="0 0 200 60" className="mini-chart">
            <polyline
              fill="none"
              stroke="var(--purple-500)"
              strokeWidth="2"
              points="0,50 40,40 80,45 120,20 160,25 200,15"
            />
          </svg>
        </div>
      )
    },
    {
      id: 'tasks',
      title: 'Aufgaben & Erinnerungen',
      type: 'tasks',
      size: 'md',
      span: 1,
      visible: true,
      position: 5,
      icon: <BellIcon />,
      content: (
        <div className="tasks-preview">
          <div className="task-preview">✓ Inventar aktualisieren</div>
          <div className="task-preview">○ Backup erstellen</div>
          <div className="task-preview">○ Export vorbereiten</div>
        </div>
      )
    }
  ]);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Load saved configuration from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('dashboardConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setCards(prevCards => 
          prevCards.map(card => {
            const savedCard = config.find((c: any) => c.id === card.id);
            if (savedCard) {
              return { ...card, ...savedCard, content: card.content, icon: card.icon };
            }
            return card;
          }).sort((a, b) => a.position - b.position)
        );
      } catch (e) {
        console.error('Error loading dashboard config:', e);
      }
    }
  }, []);

  // Save configuration to localStorage
  const saveConfig = () => {
    const config = cards.map(({ id, size, span, visible, position }) => ({
      id, size, span, visible, position
    }));
    localStorage.setItem('dashboardConfig', JSON.stringify(config));
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const draggedCard = cards[dragItem.current];
      const newCards = [...cards];
      
      // Remove dragged item
      newCards.splice(dragItem.current, 1);
      // Insert at new position
      newCards.splice(dragOverItem.current, 0, draggedCard);
      
      // Update positions
      const updatedCards = newCards.map((card, index) => ({
        ...card,
        position: index
      }));
      
      setCards(updatedCards);
      saveConfig();
    }
    
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const toggleEditMode = () => {
    const newEditMode = !editMode;
    setEditMode(newEditMode);
    if (onEditModeChange) {
      onEditModeChange(newEditMode);
    }
    if (!newEditMode) {
      saveConfig();
    }
  };

  const openEditModal = (card: CardConfig) => {
    setSelectedCard(card);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedCard(null);
  };

  const updateCard = (updates: Partial<CardConfig>) => {
    if (selectedCard) {
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === selectedCard.id
            ? { ...card, ...updates }
            : card
        )
      );
    }
  };

  const toggleCardVisibility = (cardId: string) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId
          ? { ...card, visible: !card.visible }
          : card
      )
    );
  };

  const visibleCards = cards.filter(card => card.visible);

  return (
    <div className={`flexible-dashboard ${editMode ? 'edit-mode' : ''}`}>
      {/* Dashboard Header */}
      <div className="dashboard-controls">
        <h2 className="dashboard-title">Dashboard</h2>
        <button 
          className={`edit-mode-btn ${editMode ? 'active' : ''}`}
          onClick={toggleEditMode}
        >
          <EditIcon />
          <span>{editMode ? 'Done Editing' : 'Edit Dashboard'}</span>
        </button>
      </div>

      {/* Edit Mode Toolbar */}
      {editMode && (
        <div className="edit-toolbar">
          <div className="toolbar-info">
            <span>Drag cards to reorder • Click edit icon to configure • Toggle visibility</span>
          </div>
          <div className="hidden-cards">
            {cards.filter(card => !card.visible).map(card => (
              <button
                key={card.id}
                className="hidden-card-btn"
                onClick={() => toggleCardVisibility(card.id)}
              >
                {card.icon}
                <span>{card.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {visibleCards.map((card, index) => (
          <div
            key={card.id}
            className={`dashboard-card status-card ${CARD_SIZES[card.size].className} ${CARD_SPANS[card.span].className} ${editMode ? 'draggable' : ''}`}
            draggable={editMode}
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
          >
            {editMode && (
              <div className="card-controls">
                <button className="drag-handle">
                  <DragIcon />
                </button>
                <button 
                  className="edit-btn"
                  onClick={() => openEditModal(card)}
                >
                  <EditIcon />
                </button>
                <button
                  className="hide-btn"
                  onClick={() => toggleCardVisibility(card.id)}
                >
                  <CloseIcon />
                </button>
              </div>
            )}
            
            <div className="card-header">
              <h3 className="card-title">{card.title}</h3>
              <span className="card-icon">
                {card.icon}
              </span>
            </div>
            
            <div className="card-content">
              {card.content}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedCard && (
        <div className="edit-modal-overlay" onClick={closeEditModal}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Card: {selectedCard.title}</h3>
              <button className="close-btn" onClick={closeEditModal}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Size Selection */}
              <div className="form-group">
                <label>Card Size</label>
                <div className="size-options">
                  {Object.entries(CARD_SIZES).map(([key, value]) => (
                    <button
                      key={key}
                      className={`size-option ${selectedCard.size === key ? 'active' : ''}`}
                      onClick={() => updateCard({ size: key as keyof typeof CARD_SIZES })}
                    >
                      {value.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Span Selection */}
              <div className="form-group">
                <label>Column Span</label>
                <div className="span-options">
                  {Object.entries(CARD_SPANS).map(([key, value]) => (
                    <button
                      key={key}
                      className={`span-option ${selectedCard.span === key ? 'active' : ''}`}
                      onClick={() => updateCard({ span: key as keyof typeof CARD_SPANS })}
                    >
                      {value.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Preview */}
              <div className="form-group">
                <label>Preview</label>
                <div className="preview-container">
                  <div className={`preview-card ${CARD_SIZES[selectedCard.size].className}`}>
                    <div className="preview-header">
                      <span>{selectedCard.title}</span>
                      {selectedCard.icon}
                    </div>
                    <div className="preview-size">
                      {CARD_SIZES[selectedCard.size].label} • {CARD_SPANS[selectedCard.span].label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeEditModal}>
                Cancel
              </button>
              <button className="save-btn" onClick={() => { saveConfig(); closeEditModal(); }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};