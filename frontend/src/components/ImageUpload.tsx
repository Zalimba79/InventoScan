import React, { useState, useRef, DragEvent } from 'react';
import { uploadImage, analyzeImage } from '../services/api';
import './ImageUpload.css';

interface UploadedImage {
  id: string;
  filename: string;
  original_filename: string;
  path: string;
  size: number;
  uploaded_at: string;
  preview?: string;
  analysis?: AnalysisResult;
  isAnalyzing?: boolean;
}

interface AnalysisResult {
  product_name: string;
  brand: string;
  category: string;
  description: string;
  barcode?: string;
  quantity?: string;
  additional_info?: string;
  analyzed_at: string;
}

export const ImageUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    setError(null);
    
    for (const file of files) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError(`File type not allowed: ${file.name}`);
        continue;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File too large: ${file.name} (max 10MB)`);
        continue;
      }

      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await uploadImage(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create preview URL
      const preview = URL.createObjectURL(file);
      const newImage: UploadedImage = {
        ...result,
        preview
      };

      setUploadedImages(prev => [...prev, newImage]);
      
      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleAnalyze = async (imageId: string) => {
    setError(null);
    
    // Update image to show analyzing state
    setUploadedImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isAnalyzing: true } : img
    ));

    try {
      const analysis = await analyzeImage(imageId);
      
      // Update image with analysis results
      setUploadedImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, analysis, isAnalyzing: false }
          : img
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      // Reset analyzing state
      setUploadedImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, isAnalyzing: false } : img
      ));
    }
  };

  return (
    <div className="upload-container">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <div className="upload-icon">📸</div>
        <h3>Drop images here</h3>
        <p>or click to browse</p>
        <div className="upload-formats">
          JPG, PNG, WEBP, GIF up to 10MB
        </div>

        {isUploading && (
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
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="uploaded-images">
          <h3>Uploaded Images</h3>
          <div className="image-grid">
            {uploadedImages.map((image) => (
              <div key={image.id} className="image-item">
                <div className="image-preview">
                  {image.preview && (
                    <img src={image.preview} alt={image.original_filename} />
                  )}
                  <div className="image-overlay">
                    {!image.analysis && !image.isAnalyzing && (
                      <button 
                        className="quick-action"
                        onClick={() => handleAnalyze(image.id)}
                      >
                        Analyze
                      </button>
                    )}
                    {image.isAnalyzing && (
                      <div className="analyzing-spinner">
                        <div className="spinner"></div>
                        <span>Analyzing...</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="image-info">
                  <h4>{image.original_filename}</h4>
                  <p className="image-meta">{formatFileSize(image.size)}</p>
                  
                  {image.analysis && (
                    <div className="analysis-result">
                      <div className="analysis-header">
                        <span className="analysis-badge">AI Analysis</span>
                      </div>
                      <div className="analysis-content">
                        <div className="analysis-field">
                          <span className="field-label">Product:</span>
                          <span className="field-value">{image.analysis.product_name}</span>
                        </div>
                        <div className="analysis-field">
                          <span className="field-label">Brand:</span>
                          <span className="field-value">{image.analysis.brand}</span>
                        </div>
                        <div className="analysis-field">
                          <span className="field-label">Category:</span>
                          <span className="field-value">{image.analysis.category}</span>
                        </div>
                        {image.analysis.description && (
                          <div className="analysis-field full-width">
                            <span className="field-label">Description:</span>
                            <span className="field-value">{image.analysis.description}</span>
                          </div>
                        )}
                        {image.analysis.barcode && (
                          <div className="analysis-field">
                            <span className="field-label">Barcode:</span>
                            <span className="field-value">{image.analysis.barcode}</span>
                          </div>
                        )}
                        {image.analysis.quantity && (
                          <div className="analysis-field">
                            <span className="field-label">Quantity:</span>
                            <span className="field-value">{image.analysis.quantity}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};