import React from 'react';
import { getCardContent, getCardIcon } from './DashboardCards';

// Icons für Controls
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

interface CardConfig {
  id: string;
  title: string;
  size: string;
  span: number;
  visible: boolean;
  position: number;
}

interface DynamicDashboardGridProps {
  cardConfigs: CardConfig[];
  editMode: boolean;
  isDragging: boolean;
  handleDragStart: (e: React.DragEvent, cardId: string) => void;
  handleDragEnter: (e: React.DragEvent, cardId: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  openEditModal: (cardId: string) => void;
  toggleCardVisibility: (cardId: string) => void;
}

export const DynamicDashboardGrid: React.FC<DynamicDashboardGridProps> = ({
  cardConfigs,
  editMode,
  isDragging,
  handleDragStart,
  handleDragEnter,
  handleDragOver,
  handleDragEnd,
  openEditModal,
  toggleCardVisibility
}) => {
  // Sortiere Karten nach Position und rendere nur sichtbare
  const sortedVisibleCards = cardConfigs
    .filter(card => card.visible)
    .sort((a, b) => a.position - b.position);

  console.log('Rendering cards in order:', sortedVisibleCards.map(c => c.id));

  return (
    <div className={`content-grid ${editMode ? 'edit-mode' : ''}`}>
      {sortedVisibleCards.map((card) => (
        <div
          key={card.id}
          className={`status-card card-${card.size} card-span-${card.span} ${editMode ? 'draggable' : ''} ${isDragging ? 'dragging' : ''}`}
          draggable={editMode}
          onDragStart={(e) => handleDragStart(e, card.id)}
          onDragEnter={(e) => handleDragEnter(e, card.id)}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {editMode && (
            <div className="card-controls">
              <button className="drag-handle">
                <DragIcon />
              </button>
              <button 
                className="edit-btn"
                onClick={() => openEditModal(card.id)}
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
              {getCardIcon(card.id)}
            </span>
          </div>
          
          <div className="card-content">
            {getCardContent(card.id)}
          </div>
        </div>
      ))}
    </div>
  );
};