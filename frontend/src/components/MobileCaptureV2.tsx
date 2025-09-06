import React, { useState, useCallback, useRef } from 'react';
import { NativeCamera } from './NativeCamera';
import { ProductGalleryModal } from './ProductGalleryModal';
import './MobileCaptureV2.css';

interface CapturedImage {
  id: string;
  blob: Blob;
  url: string;
  timestamp: Date;
  productGroup: number;
}

interface SessionData {
  id: string;
  startTime: Date;
  images: CapturedImage[];
  currentProductGroup: number;
}

export const MobileCaptureV2: React.FC = () => {
  const [session, setSession] = useState<SessionData>({
    id: `session-${Date.now()}`,
    startTime: new Date(),
    images: [],
    currentProductGroup: 1
  });
  
  const [showNativeCamera, setShowNativeCamera] = useState(false);
  const [useNativeCamera, setUseNativeCamera] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedProductGroup, setSelectedProductGroup] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle photo from native camera
  const handlePhotoCaptured = useCallback((photo: any) => {
    const image: CapturedImage = {
      ...photo,
      productGroup: session.currentProductGroup
    };
    
    setSession(prev => ({
      ...prev,
      images: [...prev.images, image]
    }));
    
    setShowNativeCamera(false);
  }, [session.currentProductGroup]);

  // Start new product group
  const startNewProduct = () => {
    setSession(prev => ({
      ...prev,
      currentProductGroup: prev.currentProductGroup + 1
    }));
    
    // Visual feedback
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = `Produkt #${session.currentProductGroup + 1}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  // Upload session
  const uploadSession = async () => {
    if (session.images.length === 0) return;
    
    const formData = new FormData();
    formData.append('session_id', session.id);
    
    session.images.forEach((img, index) => {
      formData.append(`images`, img.blob, `${img.id}.jpg`);
      formData.append(`product_groups`, img.productGroup.toString());
    });
    
    try {
      const response = await fetch('/api/batch-upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert(`✅ ${session.images.length} Bilder hochgeladen!`);
        // Reset session
        setSession({
          id: `session-${Date.now()}`,
          startTime: new Date(),
          images: [],
          currentProductGroup: 1
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload fehlgeschlagen');
    }
  };

  // Remove image
  const removeImage = (imageId: string) => {
    setSession(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  return (
    <div className="mobile-capture-v2">
      {/* Header */}
      <div className="capture-header">
        <div className="header-top">
          <h2>Inventar Erfassung</h2>
          <div className="camera-mode-toggle">
            <button 
              className={useNativeCamera ? 'active' : ''}
              onClick={() => setUseNativeCamera(true)}
            >
              iOS
            </button>
            <button 
              className={!useNativeCamera ? 'active' : ''}
              onClick={() => setUseNativeCamera(false)}
            >
              Web
            </button>
          </div>
        </div>
        <div className="session-stats">
          <span className="stat">
            <strong>Produkt #{session.currentProductGroup}</strong>
          </span>
          <span className="stat">{session.images.length} Fotos</span>
        </div>
      </div>

      {/* Main Actions */}
      <div className="main-actions">
        {/* Camera Button - Big and Central */}
        <button 
          className="btn-camera-main"
          onClick={() => {
            if (useNativeCamera) {
              setShowNativeCamera(true);
            } else {
              // Use web camera (your existing implementation)
              alert('Web-Kamera noch nicht implementiert');
            }
          }}
        >
          <div className="camera-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 2L7 5H4C3 5 2 6 2 7v12c0 1 1 2 2 2h16c1 0 2-1 2-2V7c0-1-1-2-2-2h-3l-2-3H9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>Foto aufnehmen</span>
        </button>

        {/* Secondary Actions */}
        <div className="secondary-actions">
          <button 
            className="btn-new-product"
            onClick={startNewProduct}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Neues Produkt
          </button>

          <button 
            className="btn-gallery"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
              <path d="M21 15l-5-5L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Galerie
          </button>
        </div>
      </div>

      {/* Native Camera (hidden, triggered programmatically) */}
      {showNativeCamera && (
        <NativeCamera 
          onPhotoCaptured={handlePhotoCaptured}
          onClose={() => setShowNativeCamera(false)}
          multiple={false}
        />
      )}

      {/* Hidden file input for gallery */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        multiple
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            Array.from(files).forEach(file => {
              handlePhotoCaptured({
                id: `file-${Date.now()}-${Math.random()}`,
                blob: file,
                url: URL.createObjectURL(file),
                timestamp: new Date()
              });
            });
          }
        }}
        style={{ display: 'none' }}
      />

      {/* Image Grid - Horizontal Scroll */}
      <div className="images-section">
        <h3>Erfasste Produkte</h3>
        <div className="products-scroll-container">
          <div className="products-scroll">
            {Object.entries(
              session.images.reduce((acc, img) => {
                if (!acc[img.productGroup]) {
                  acc[img.productGroup] = [];
                }
                acc[img.productGroup].push(img);
                return acc;
              }, {} as Record<number, CapturedImage[]>)
            ).map(([group, images]) => (
              <div key={group} className="product-card">
                <div className="card-header">
                  <h4>Produkt #{group}</h4>
                  <span className="badge">{images.length}</span>
                </div>
                <div className="card-images">
                  {/* Show main image */}
                  <div 
                    className="main-image"
                    onClick={() => {
                      setSelectedProductGroup(Number(group));
                      setGalleryOpen(true);
                    }}
                  >
                    <img src={images[0].url} alt={`Product ${group}`} />
                    {images.length > 1 && (
                      <div className="more-indicator">+{images.length - 1}</div>
                    )}
                  </div>
                  {/* Thumbnail strip */}
                  {images.length > 1 && (
                    <div className="thumbnails">
                      {images.slice(1, 4).map(img => (
                        <img key={img.id} src={img.url} alt="" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="card-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => {
                      // Open edit view for this product group
                      alert(`Bearbeite Produkt #${group}`);
                    }}
                  >
                    Bearbeiten
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => {
                      if (confirm(`Produkt #${group} löschen?`)) {
                        images.forEach(img => {
                          URL.revokeObjectURL(img.url);
                          removeImage(img.id);
                        });
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            
            {/* Add New Product Card */}
            <div className="product-card add-card" onClick={startNewProduct}>
              <div className="add-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
                  <path d="M12 8v8m-4-4h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span>Neues Produkt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bottom-actions">
        <button 
          className="btn-clear"
          onClick={() => {
            if (confirm('Alle Fotos löschen?')) {
              session.images.forEach(img => URL.revokeObjectURL(img.url));
              setSession(prev => ({
                ...prev,
                images: [],
                currentProductGroup: 1
              }));
            }
          }}
        >
          Alles löschen
        </button>
        
        <button 
          className="btn-upload"
          onClick={uploadSession}
          disabled={session.images.length === 0}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Hochladen ({session.images.length})
        </button>
      </div>

      {/* Gallery Modal */}
      {galleryOpen && selectedProductGroup !== null && (
        <ProductGalleryModal
          isOpen={galleryOpen}
          onClose={() => {
            setGalleryOpen(false);
            setSelectedProductGroup(null);
          }}
          productNumber={selectedProductGroup}
          images={session.images
            .filter(img => img.productGroup === selectedProductGroup)
            .map(img => ({ id: img.id, url: img.url, blob: img.blob }))}
        />
      )}
    </div>
  );
};