import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CameraCapture } from './CameraCapture';
import './MobileCapture.css';

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

export const MobileCapture: React.FC = () => {
  const [session, setSession] = useState<SessionData>({
    id: `session-${Date.now()}`,
    startTime: new Date(),
    images: [],
    currentProductGroup: 1
  });
  
  const [showCamera, setShowCamera] = useState(false);
  const [separationMode, setSeparationMode] = useState<'manual' | 'voice' | 'shake' | 'ai'>('manual');
  const [isListening, setIsListening] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle photo from camera
  const handlePhotoCaptured = useCallback((photo: any) => {
    const image: CapturedImage = {
      id: photo.id,
      blob: photo.blob,
      url: photo.url,
      timestamp: photo.timestamp,
      productGroup: session.currentProductGroup
    };
    
    setSession(prev => ({
      ...prev,
      images: [...prev.images, image]
    }));
    
    setShowCamera(false);
    
    // Auto new product if in manual mode
    if (separationMode === 'manual') {
      setTimeout(() => startNewProduct(), 500);
    }
  }, [session.currentProductGroup, separationMode]);

  // New product group (manual button)
  const startNewProduct = () => {
    setSession(prev => ({
      ...prev,
      currentProductGroup: prev.currentProductGroup + 1
    }));
    
    // Visual feedback
    const badge = document.createElement('div');
    badge.className = 'new-product-badge';
    badge.textContent = `Neues Produkt #${session.currentProductGroup + 1}`;
    document.body.appendChild(badge);
    setTimeout(() => badge.remove(), 2000);
  };

  // Voice recognition for "Neuer Artikel"
  useEffect(() => {
    if (separationMode === 'voice' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'de-DE';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        
        if (transcript.includes('neuer artikel') || transcript.includes('nächster artikel')) {
          startNewProduct();
          // Audio feedback
          const synth = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance('Neues Produkt');
          utterance.lang = 'de-DE';
          synth.speak(utterance);
        }
        
        if (transcript.includes('foto') || transcript.includes('aufnahme')) {
          setShowCamera(true);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
      
      if (isListening) {
        recognition.start();
      } else {
        recognition.stop();
      }
      
      return () => {
        recognition.stop();
      };
    }
  }, [separationMode, isListening]);

  // Shake detection for new product
  useEffect(() => {
    if (separationMode === 'shake' && 'DeviceMotionEvent' in window) {
      let lastShake = 0;
      const threshold = 25;
      let lastX = 0, lastY = 0, lastZ = 0;
      
      const handleMotion = (event: DeviceMotionEvent) => {
        const current = event.accelerationIncludingGravity;
        if (!current) return;
        
        const deltaX = Math.abs(lastX - (current.x || 0));
        const deltaY = Math.abs(lastY - (current.y || 0));
        const deltaZ = Math.abs(lastZ - (current.z || 0));
        
        if (deltaX + deltaY + deltaZ > threshold) {
          const now = Date.now();
          if (now - lastShake > 1000) {
            lastShake = now;
            startNewProduct();
            // Vibrate feedback
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
          }
        }
        
        lastX = current.x || 0;
        lastY = current.y || 0;
        lastZ = current.z || 0;
      };
      
      // Request permission for iOS
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        (DeviceMotionEvent as any).requestPermission()
          .then((response: string) => {
            if (response === 'granted') {
              window.addEventListener('devicemotion', handleMotion);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('devicemotion', handleMotion);
      }
      
      return () => {
        window.removeEventListener('devicemotion', handleMotion);
      };
    }
  }, [separationMode]);

  // Handle file selection for existing photos
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    Array.from(files).forEach((file, index) => {
      const image: CapturedImage = {
        id: `file-${Date.now()}-${index}`,
        blob: file,
        url: URL.createObjectURL(file),
        timestamp: new Date(),
        productGroup: session.currentProductGroup
      };
      
      setSession(prev => ({
        ...prev,
        images: [...prev.images, image]
      }));
      
      // Auto-increment product group after each file
      if (separationMode === 'manual' && index < files.length - 1) {
        setTimeout(() => {
          setSession(prev => ({
            ...prev,
            currentProductGroup: prev.currentProductGroup + 1
          }));
        }, 100 * (index + 1));
      }
    });
  };

  // Upload session to server
  const uploadSession = async () => {
    setUploadProgress(0);
    
    const groupedImages = session.images.reduce((acc, img) => {
      if (!acc[img.productGroup]) {
        acc[img.productGroup] = [];
      }
      acc[img.productGroup].push(img);
      return acc;
    }, {} as Record<number, CapturedImage[]>);
    
    const totalImages = session.images.length;
    let uploaded = 0;
    
    for (const [group, images] of Object.entries(groupedImages)) {
      const formData = new FormData();
      formData.append('session_id', session.id);
      formData.append('product_group', group);
      
      images.forEach(img => {
        formData.append('images', img.blob, `${img.id}.jpg`);
      });
      
      try {
        const response = await fetch('/api/batch-upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          uploaded += images.length;
          setUploadProgress((uploaded / totalImages) * 100);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    
    if (uploaded === totalImages) {
      alert(`Erfolgreich ${uploaded} Bilder in ${Object.keys(groupedImages).length} Produktgruppen hochgeladen!`);
      // Reset session
      setSession({
        id: `session-${Date.now()}`,
        startTime: new Date(),
        images: [],
        currentProductGroup: 1
      });
    }
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      session.images.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, [session.images]);

  return (
    <div className="mobile-capture">
      {/* Header */}
      <div className="capture-header">
        <h2>Mobile Erfassung</h2>
        <div className="session-info">
          <span>Session: {session.id.slice(-8)}</span>
          <span>Produkt #{session.currentProductGroup}</span>
          <span>{session.images.length} Bilder</span>
        </div>
      </div>

      {/* Camera View */}
      {showCamera && (
        <CameraCapture 
          onPhotoCaptured={handlePhotoCaptured}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Preview */}
      {previewImage && (
        <div className="preview-container">
          <img src={previewImage} alt="Preview" className="preview-image" />
          <button 
            className="preview-close"
            onClick={() => setPreviewImage(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="capture-controls">
        {/* Camera Toggle */}
        <button 
          className="btn-camera"
          onClick={() => setShowCamera(true)}
        >
          📷 Kamera öffnen
        </button>

        {/* File Upload */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button 
          className="btn-upload"
          onClick={() => fileInputRef.current?.click()}
        >
          📁 Bilder auswählen
        </button>

        {/* Separation Mode */}
        <div className="separation-modes">
          <label>Trennung:</label>
          <select 
            value={separationMode}
            onChange={(e) => setSeparationMode(e.target.value as any)}
            className="mode-select"
          >
            <option value="manual">Manuell (Button)</option>
            <option value="voice">Sprachbefehl</option>
            <option value="shake">Schütteln</option>
            <option value="ai">KI-Erkennung</option>
          </select>
        </div>

        {/* Voice Control */}
        {separationMode === 'voice' && (
          <button 
            className={`btn-voice ${isListening ? 'active' : ''}`}
            onClick={() => setIsListening(!isListening)}
          >
            {isListening ? '🎤 Spracherkennung aktiv' : '🎤 Spracherkennung starten'}
          </button>
        )}

        {/* Shake Info */}
        {separationMode === 'shake' && (
          <div className="shake-info">
            📱 Gerät schütteln für neues Produkt
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div className="captured-images">
        <h3>Erfasste Produkte</h3>
        {Object.entries(
          session.images.reduce((acc, img) => {
            if (!acc[img.productGroup]) {
              acc[img.productGroup] = [];
            }
            acc[img.productGroup].push(img);
            return acc;
          }, {} as Record<number, CapturedImage[]>)
        ).map(([group, images]) => (
          <div key={group} className="product-group">
            <h4>Produkt #{group}</h4>
            <div className="image-grid">
              {images.map(img => (
                <div key={img.id} className="image-item">
                  <img src={img.url} alt={`Product ${group}`} />
                  <button 
                    className="remove-btn"
                    onClick={() => {
                      URL.revokeObjectURL(img.url);
                      setSession(prev => ({
                        ...prev,
                        images: prev.images.filter(i => i.id !== img.id)
                      }));
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span>{uploadProgress.toFixed(0)}% hochgeladen</span>
        </div>
      )}

      {/* Actions */}
      <div className="capture-actions">
        <button 
          className="btn-clear"
          onClick={() => {
            if (confirm('Alle Bilder löschen?')) {
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
          className="btn-upload-session"
          onClick={uploadSession}
          disabled={session.images.length === 0}
        >
          📤 Session hochladen ({session.images.length} Bilder)
        </button>
      </div>
    </div>
  );
};