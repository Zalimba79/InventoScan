import React, { useState, useEffect } from 'react';
import './ProductGalleryModal.css';

interface GalleryImage {
  id: string;
  url: string;
  blob?: Blob;
}

interface ProductGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productNumber: number;
  images: GalleryImage[];
}

export const ProductGalleryModal: React.FC<ProductGalleryModalProps> = ({
  isOpen,
  onClose,
  productNumber,
  images
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="gallery-modal" onClick={onClose}>
      <div className="gallery-header">
        <button className="gallery-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 5L5 19M5 5l14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h3>Produkt #{productNumber}</h3>
        <span className="image-counter">{currentIndex + 1} / {images.length}</span>
      </div>

      <div 
        className="gallery-content"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="gallery-slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image) => (
            <div key={image.id} className="gallery-slide">
              <img src={image.url} alt={`Bild ${image.id}`} />
            </div>
          ))}
        </div>

        {currentIndex > 0 && (
          <button className="gallery-nav gallery-nav-prev" onClick={goToPrevious}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {currentIndex < images.length - 1 && (
          <button className="gallery-nav gallery-nav-next" onClick={goToNext}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className="gallery-thumbnails">
        {images.map((image, index) => (
          <button
            key={image.id}
            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
          >
            <img src={image.url} alt={`Thumbnail ${index + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
};