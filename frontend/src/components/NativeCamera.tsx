import React, { useRef, useState, useCallback } from 'react';
import './NativeCamera.css';

interface CapturedPhoto {
  id: string;
  blob: Blob;
  url: string;
  timestamp: Date;
}

interface NativeCameraProps {
  onPhotoCaptured?: (photo: CapturedPhoto) => void;
  onClose?: () => void;
  multiple?: boolean;
}

export const NativeCamera: React.FC<NativeCameraProps> = ({ 
  onPhotoCaptured, 
  onClose,
  multiple = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Open native camera/gallery
  const openNativeCamera = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Handle file selection from native camera
  const handleFileCapture = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      if (onClose) onClose();
      return;
    }

    setIsProcessing(true);

    try {
      // Process each captured photo
      for (const file of Array.from(files)) {
        // Create photo object
        const photo: CapturedPhoto = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          blob: file,
          url: URL.createObjectURL(file),
          timestamp: new Date()
        };

        // Call callback
        if (onPhotoCaptured) {
          onPhotoCaptured(photo);
        }

        // Small delay between multiple photos
        if (files.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } finally {
      setIsProcessing(false);
      // Reset input for next capture
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onClose) onClose();
    }
  }, [onPhotoCaptured, onClose]);

  // Auto-open camera on mount
  React.useEffect(() => {
    // Small delay to ensure component is mounted
    const timer = setTimeout(() => {
      openNativeCamera();
    }, 100);

    return () => clearTimeout(timer);
  }, [openNativeCamera]);

  return (
    <div className="native-camera">
      {/* Hidden file input that triggers native camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment" // Use back camera by default
        multiple={multiple}
        onChange={handleFileCapture}
        style={{ display: 'none' }}
      />

      {/* Processing overlay */}
      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-spinner" />
          <p>Verarbeite Foto...</p>
        </div>
      )}
    </div>
  );
};