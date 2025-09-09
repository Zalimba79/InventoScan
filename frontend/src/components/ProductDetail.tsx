import React, { useState, useEffect } from 'react';
import { createSafeImageProps } from '../utils/security';
import './ProductDetail.css';

interface Product {
  id: string;
  name: string;
  brand: string;
  barcode?: string;
  category?: string;
  stock_quantity: number;
  location?: string;
  price_regular?: number;
  price_cost?: number;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  min_stock?: number;
  supplier?: string;
  supplier_sku?: string;
  weight_kg?: number;
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
}

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'stock' | 'pricing' | 'dimensions'>('overview');

  useEffect(() => {
    // Mock data - will be replaced with API call
    const mockProduct: Product = {
      id: productId,
      name: 'Einpressmutter Senkkopf M4',
      brand: 'WÜRTH',
      barcode: '4047376706309',
      category: 'Befestigungstechnik',
      stock_quantity: 100,
      location: 'Regal A3',
      price_regular: 45.90,
      price_cost: 32.00,
      description: 'Hochwertige Einpressmutter für dauerhafte Verbindungen in Metallkonstruktionen.',
      created_at: '2024-01-15',
      updated_at: '2024-01-20',
      min_stock: 50,
      supplier: 'WÜRTH GmbH',
      supplier_sku: 'WTH-123456',
      weight_kg: 0.015,
      length_cm: 10,
      width_cm: 10,
      height_cm: 5
    };
    
    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 500);
  }, [productId]);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner"></div>
        <p>Lade Produktdetails...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail-error">
        <p>Produkt nicht gefunden</p>
        <button onClick={onBack} className="btn-back">Zurück zum Katalog</button>
      </div>
    );
  }

  const stockStatus = product.stock_quantity > (product.min_stock || 0) ? 'good' : 'low';
  const margin = product.price_regular && product.price_cost 
    ? ((product.price_regular - product.price_cost) / product.price_regular * 100).toFixed(1)
    : null;

  return (
    <div className="detail-container">
      {/* Header */}
      <div className="detail-header">
        <button onClick={onBack} className="btn-back">
          ← Zurück zum Katalog
        </button>
        <div className="detail-actions">
          <button className="btn-edit">Bearbeiten</button>
          <button className="btn-delete">Löschen</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-content">
        {/* Product Image and Basic Info */}
        <div className="detail-main">
          <div className="detail-image">
            {product.image_url ? (
              <img {...createSafeImageProps(product.image_url || '', product.name)} />
            ) : (
              <div className="image-placeholder">
                <span>📦</span>
              </div>
            )}
          </div>

          <div className="detail-info">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-brand">{product.brand}</p>
            
            {product.barcode && (
              <div className="product-barcode">
                <span className="barcode-icon">||| |||</span>
                <span>{product.barcode}</span>
              </div>
            )}

            {product.description && (
              <p className="product-description">{product.description}</p>
            )}

            <div className="quick-stats">
              <div className={`stat-card stock-${stockStatus}`}>
                <span className="stat-label">Bestand</span>
                <span className="stat-value">{product.stock_quantity}</span>
                {product.min_stock && (
                  <span className="stat-detail">Min: {product.min_stock}</span>
                )}
              </div>
              
              <div className="stat-card">
                <span className="stat-label">Lagerort</span>
                <span className="stat-value">{product.location || 'N/A'}</span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Kategorie</span>
                <span className="stat-value">{product.category || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tab-nav">
            <button 
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              Übersicht
            </button>
            <button 
              className={activeTab === 'stock' ? 'active' : ''}
              onClick={() => setActiveTab('stock')}
            >
              Lagerbestand
            </button>
            <button 
              className={activeTab === 'pricing' ? 'active' : ''}
              onClick={() => setActiveTab('pricing')}
            >
              Preise
            </button>
            <button 
              className={activeTab === 'dimensions' ? 'active' : ''}
              onClick={() => setActiveTab('dimensions')}
            >
              Abmessungen
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="tab-panel">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Produkt ID</label>
                    <span>{product.id}</span>
                  </div>
                  <div className="info-item">
                    <label>Erstellt am</label>
                    <span>{new Date(product.created_at).toLocaleDateString('de-DE')}</span>
                  </div>
                  {product.updated_at && (
                    <div className="info-item">
                      <label>Zuletzt aktualisiert</label>
                      <span>{new Date(product.updated_at).toLocaleDateString('de-DE')}</span>
                    </div>
                  )}
                  {product.supplier && (
                    <div className="info-item">
                      <label>Lieferant</label>
                      <span>{product.supplier}</span>
                    </div>
                  )}
                  {product.supplier_sku && (
                    <div className="info-item">
                      <label>Lieferanten-SKU</label>
                      <span>{product.supplier_sku}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'stock' && (
              <div className="tab-panel">
                <div className="stock-overview">
                  <div className="stock-chart">
                    <div className="stock-bar">
                      <div 
                        className="stock-fill"
                        style={{ 
                          width: `${Math.min(100, (product.stock_quantity / 200) * 100)}%`,
                          backgroundColor: stockStatus === 'good' ? 'var(--success)' : 'var(--warning)'
                        }}
                      />
                    </div>
                    <div className="stock-labels">
                      <span>0</span>
                      <span>Aktuell: {product.stock_quantity}</span>
                      <span>200</span>
                    </div>
                  </div>

                  <div className="stock-actions">
                    <button className="btn-stock-add">+ Lagereingang</button>
                    <button className="btn-stock-remove">- Lagerabgang</button>
                    <button className="btn-stock-history">Verlauf anzeigen</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="tab-panel">
                <div className="pricing-grid">
                  <div className="price-card">
                    <label>Einkaufspreis</label>
                    <span className="price">€{product.price_cost?.toFixed(2) || 'N/A'}</span>
                  </div>
                  <div className="price-card">
                    <label>Verkaufspreis</label>
                    <span className="price">€{product.price_regular?.toFixed(2) || 'N/A'}</span>
                  </div>
                  {margin && (
                    <div className="price-card">
                      <label>Marge</label>
                      <span className="price">{margin}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'dimensions' && (
              <div className="tab-panel">
                <div className="dimensions-grid">
                  <div className="dimension-item">
                    <label>Gewicht</label>
                    <span>{product.weight_kg ? `${product.weight_kg} kg` : 'N/A'}</span>
                  </div>
                  <div className="dimension-item">
                    <label>Länge</label>
                    <span>{product.length_cm ? `${product.length_cm} cm` : 'N/A'}</span>
                  </div>
                  <div className="dimension-item">
                    <label>Breite</label>
                    <span>{product.width_cm ? `${product.width_cm} cm` : 'N/A'}</span>
                  </div>
                  <div className="dimension-item">
                    <label>Höhe</label>
                    <span>{product.height_cm ? `${product.height_cm} cm` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};