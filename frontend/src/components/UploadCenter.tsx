import React, { useState, useRef } from 'react';
import { BaseWithTabs, type TabContentData } from './layout/BaseWithTabs';
import './UploadCenter.css';

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

const FolderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const UploadContent: React.FC = () => {
  const [productGroup, setProductGroup] = useState('Neues Produkt');
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const productGroups = [
    'Neues Produkt',
    'Elektronik',
    'Bücher',
    'Kleidung',
    'Spielzeug',
    'Haushalt',
    'Sport & Freizeit',
    'Sammlung',
    'Sonstiges'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsWebcamActive(true);
    } catch (error) {
      console.error('Fehler beim Kamera-Zugriff:', error);
      alert('Kamera-Zugriff nicht möglich. Bitte Berechtigungen prüfen.');
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `webcam-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setSelectedFiles(prev => [...prev, file]);
          }
        }, 'image/jpeg');
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Bitte wählen Sie mindestens eine Datei aus.');
      return;
    }

    setUploadProgress(0);
    
    // Simuliere Upload-Fortschritt
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          alert(`${selectedFiles.length} Datei(en) erfolgreich hochgeladen!${autoAnalyze ? ' Automatische Analyse gestartet.' : ''}`);
          setSelectedFiles([]);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="upload-content-wrapper">
      <div className="upload-section">
        <div className="section-header">
          <span className="section-icon">🧾</span>
          <h3>Produktgruppe</h3>
        </div>
        <select 
          className="product-group-select"
          value={productGroup}
          onChange={(e) => setProductGroup(e.target.value)}
        >
          {productGroups.map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>

      <div className="upload-section">
        <div className="section-header">
          <span className="section-icon">📸</span>
          <h3>Upload-Funktionen</h3>
        </div>
        
        <div className="upload-options">
          <div 
            className="upload-option"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileIcon />
            <span>Datei wählen</span>
            <small>Einzelbild oder mehrere</small>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>

          <div 
            className="upload-option"
            onClick={() => folderInputRef.current?.click()}
          >
            <FolderIcon />
            <span>Ordner hochladen</span>
            <small>z.B. Kameraordner</small>
            <input
              ref={folderInputRef}
              type="file"
              multiple
              webkitdirectory=""
              directory=""
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>

          <div 
            className="upload-option"
            onClick={isWebcamActive ? stopWebcam : startWebcam}
          >
            <CameraIcon />
            <span>Webcam-Aufnahme</span>
            <small>{isWebcamActive ? 'Aktiv' : 'Livebild mit Auslöser'}</small>
          </div>
        </div>

        {isWebcamActive && (
          <div className="webcam-container">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="webcam-preview"
            />
            <div className="webcam-controls">
              <button className="capture-button" onClick={capturePhoto}>
                📸 Foto aufnehmen
              </button>
              <button className="stop-button" onClick={stopWebcam}>
                ⏹ Kamera beenden
              </button>
            </div>
          </div>
        )}

        <div 
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <UploadIcon />
          <p>Dateien hier ablegen</p>
          <small>oder eine der obigen Optionen wählen</small>
        </div>

        {selectedFiles.length > 0 && (
          <div className="selected-files">
            <h3>Ausgewählte Dateien ({selectedFiles.length})</h3>
            <div className="file-list">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  <button 
                    className="remove-file"
                    onClick={() => removeFile(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="upload-section">
        <div className="section-header">
          <span className="section-icon">🧠</span>
          <h3>Optionen</h3>
        </div>
        
        <label className="auto-analyze-checkbox">
          <input
            type="checkbox"
            checked={autoAnalyze}
            onChange={(e) => setAutoAnalyze(e.target.checked)}
          />
          <span className="checkbox-label">
            📊 Nach Upload automatisch analysieren
          </span>
        </label>
      </div>

      {uploadProgress > 0 && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="progress-text">{uploadProgress}%</span>
        </div>
      )}

      <div className="upload-actions">
        <button 
          className="upload-button"
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || uploadProgress > 0}
        >
          {uploadProgress > 0 ? 'Wird hochgeladen...' : 'Produkt erfassen'}
        </button>
      </div>
    </div>
  );
};

const RecentUploads: React.FC = () => {
  const recentItems = [
    { id: 1, name: 'iPhone 13 Pro', date: '2024-01-15', status: 'Analysiert' },
    { id: 2, name: 'Samsung TV', date: '2024-01-14', status: 'In Bearbeitung' },
    { id: 3, name: 'Nike Schuhe', date: '2024-01-13', status: 'Hochgeladen' },
    { id: 4, name: 'Lego Set', date: '2024-01-12', status: 'Analysiert' },
    { id: 5, name: 'Bücher Sammlung', date: '2024-01-11', status: 'Analysiert' },
  ];

  return (
    <div className="recent-uploads">
      <div className="recent-list">
        {recentItems.map(item => (
          <div key={item.id} className="recent-item">
            <div className="recent-item-info">
              <span className="recent-item-name">{item.name}</span>
              <span className="recent-item-date">{item.date}</span>
            </div>
            <span className={`recent-item-status status-${item.status.toLowerCase().replace(' ', '-')}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BatchProcessing: React.FC = () => {
  const batchJobs = [
    { id: 1, name: 'Kameraordner Import', files: 42, progress: 75 },
    { id: 2, name: 'Backup Wiederherstellung', files: 128, progress: 30 },
    { id: 3, name: 'Sammlung Digitalisierung', files: 15, progress: 100 },
  ];

  return (
    <div className="batch-processing">
      <div className="batch-list">
        {batchJobs.map(job => (
          <div key={job.id} className="batch-item">
            <div className="batch-info">
              <span className="batch-name">{job.name}</span>
              <span className="batch-files">{job.files} Dateien</span>
            </div>
            <div className="batch-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
              <span className="progress-text">{job.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const UploadCenter: React.FC = () => {
  const tabs: TabContentData[] = [
    {
      id: 'upload',
      label: 'Hochladen',
      icon: <UploadIcon />,
      content: {
        title: 'Neue Produkte erfassen',
        description: 'Laden Sie Fotos hoch oder nutzen Sie die Webcam für die Produkterfassung',
        component: <UploadContent />
      }
    },
    {
      id: 'recent',
      label: 'Letzte Uploads',
      icon: <FileIcon />,
      content: {
        title: 'Kürzlich hochgeladene Produkte',
        description: 'Überblick über Ihre letzten Uploads und deren Bearbeitungsstatus',
        component: <RecentUploads />
      }
    },
    {
      id: 'batch',
      label: 'Stapelverarbeitung',
      icon: <FolderIcon />,
      content: {
        title: 'Batch-Jobs',
        description: 'Verarbeitung größerer Mengen von Produktbildern',
        component: <BatchProcessing />
      }
    }
  ];

  return (
    <BaseWithTabs
      title="Upload-Zentrale"
      subtitle="Erfassen Sie neue Produkte schnell und einfach"
      tabs={tabs}
      defaultTab="upload"
      className="upload-center-tabs"
    />
  );
};

// TypeScript declarations for folder input
declare module 'react' {
  interface InputHTMLAttributes<T> extends React.HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}