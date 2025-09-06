import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CameraCapture.css';
import '../styles/ios-fixes.css';

interface CapturedPhoto {
  id: string;
  blob: Blob;
  url: string;
  timestamp: Date;
}

interface CameraCaptureProps {
  onPhotoCaptured?: (photo: CapturedPhoto) => void;
  onClose?: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onPhotoCaptured, 
  onClose 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for multiple cameras
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      setHasMultipleCameras(videoInputs.length > 1);
    });
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Kamera-Zugriff verweigert. Bitte Berechtigungen prüfen.');
    }
  }, [facingMode]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsActive(false);
    }
  }, []);

  // Switch camera
  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  }, []);

  // Toggle flash
  const toggleFlash = useCallback(() => {
    setFlashMode(prev => {
      if (prev === 'off') return 'on';
      if (prev === 'on') return 'auto';
      return 'off';
    });

    // Apply flash to video track if supported
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      
      if ('torch' in capabilities) {
        track.applyConstraints({
          advanced: [{ torch: flashMode === 'on' }]
        } as any);
      }
    }
  }, [flashMode]);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;
    
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      setIsCapturing(false);
      return;
    }
    
    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Apply flash effect if on
    if (flashMode === 'on' || flashMode === 'auto') {
      const flashOverlay = document.createElement('div');
      flashOverlay.className = 'flash-overlay';
      document.body.appendChild(flashOverlay);
      setTimeout(() => flashOverlay.remove(), 200);
    }
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0);
    
    // Play shutter sound
    const audio = new Audio('data:audio/wav;base64,UklGRhwMAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgMAACCAIEBhQOBA4kCjwKMAowHlwKVAZUDlAKBgo8HmwOcAZ8JmAOkCZkIjgeZCJYFkwaTCY8HlwmUA5cDlgWTCZMGjQiMApAEjASXBJUCmQKVAZQFlAWUBZQGlAaYCpkIlwOaBJoCnQOcAZ4GmwKdA50FnAOiA58GpAemBKIDpgKmAKsBpwOmBKcGrQasAawFqwSqAqkGowapAqgEqASqBagGqASwAq8EsgKzALEFtgO2CLMGswO1BbMGtQiTEJMTjxCTEY8OiQ+LCokHkwWEBYQDiASJCY0IigiBAAgAAA==');
    audio.play().catch(() => {});
    
    // Vibrate for feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Convert to blob
    canvas.toBlob(blob => {
      if (blob) {
        const photo: CapturedPhoto = {
          id: `photo-${Date.now()}`,
          blob,
          url: URL.createObjectURL(blob),
          timestamp: new Date()
        };
        
        setCapturedPhoto(photo);
        stopCamera();
      }
      setIsCapturing(false);
    }, 'image/jpeg', 0.95);
  }, [flashMode, stopCamera, isCapturing]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const photo: CapturedPhoto = {
      id: `file-${Date.now()}`,
      blob: file,
      url: URL.createObjectURL(file),
      timestamp: new Date()
    };
    
    setCapturedPhoto(photo);
  };

  // Confirm photo
  const confirmPhoto = () => {
    if (capturedPhoto && onPhotoCaptured) {
      onPhotoCaptured(capturedPhoto);
    }
    resetCapture();
  };

  // Reset capture
  const resetCapture = () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto.url);
    }
    setCapturedPhoto(null);
    startCamera();
  };

  // Discard photo
  const discardPhoto = () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto.url);
    }
    setCapturedPhoto(null);
    startCamera();
  };

  // Start camera on mount and handle iOS viewport
  useEffect(() => {
    startCamera();
    
    // Force fullscreen on iOS
    const meta = document.querySelector('meta[name="viewport"]');
    const originalContent = meta?.getAttribute('content');
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
    
    // Hide Safari UI by scrolling
    window.scrollTo(0, 1);
    
    // Prevent body scroll and add camera-active class
    document.body.classList.add('camera-active');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    return () => {
      stopCamera();
      if (capturedPhoto) {
        URL.revokeObjectURL(capturedPhoto.url);
      }
      
      // Restore viewport
      if (meta && originalContent) {
        meta.setAttribute('content', originalContent);
      }
      
      // Restore body scroll and remove camera-active class
      document.body.classList.remove('camera-active');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [facingMode]);

  // Close handler
  const handleClose = () => {
    stopCamera();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="camera-capture">
      {/* Camera View */}
      {!capturedPhoto && (
        <div className="camera-view">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="camera-video"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {/* Top Controls */}
          <div className="camera-top-controls">
            <button 
              className="btn-close"
              onClick={handleClose}
              aria-label="Schließen"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <button 
              className={`btn-flash flash-${flashMode}`}
              onClick={toggleFlash}
              aria-label="Blitz"
            >
              {flashMode === 'off' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
              {flashMode === 'on' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              )}
              {flashMode === 'auto' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <text x="14" y="20" fontSize="8" fill="currentColor">A</text>
                </svg>
              )}
            </button>
          </div>
          
          {/* Bottom Controls */}
          <div className="camera-bottom-controls">
            {/* Gallery Button */}
            <button 
              className="btn-gallery"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Galerie"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                <path d="M21 15l-5-5L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Shutter Button */}
            <button 
              className={`btn-shutter ${isCapturing ? 'capturing' : ''}`}
              onClick={capturePhoto}
              disabled={!isActive || isCapturing}
              aria-label="Foto aufnehmen"
            >
              <div className="shutter-outer">
                <div className="shutter-inner" />
              </div>
            </button>
            
            {/* Switch Camera Button */}
            {hasMultipleCameras && (
              <button 
                className="btn-switch"
                onClick={switchCamera}
                aria-label="Kamera wechseln"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M16 3h4v4M8 21H4v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 3l-7 7M4 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            )}
          </div>
          
          {/* Hidden file input */}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}
      
      {/* Photo Review */}
      {capturedPhoto && (
        <div className="photo-review">
          <img 
            src={capturedPhoto.url} 
            alt="Captured" 
            className="review-image"
          />
          
          <div className="review-controls">
            <button 
              className="btn-discard"
              onClick={discardPhoto}
              aria-label="Verwerfen"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Verwerfen</span>
            </button>
            
            <button 
              className="btn-retake"
              onClick={resetCapture}
              aria-label="Neu aufnehmen"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Neu</span>
            </button>
            
            <button 
              className="btn-confirm"
              onClick={confirmPhoto}
              aria-label="Bestätigen"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Verwenden</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};