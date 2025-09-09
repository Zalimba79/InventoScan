import React, { useState, useEffect } from 'react';
import './MarketplacePanel.css';

// Icons
const Package = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const ShoppingBag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const CheckCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const AlertCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Download = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const Upload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const ExternalLink = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

interface Product {
  id: string;
  title: string;
  sku: string;
  brand: string;
  price_regular: number;
  price_ebay?: number;
  price_amazon?: number;
  stock_quantity: number;
  status: string;
  listed_on_ebay?: boolean;
  listed_on_amazon?: boolean;
  ean?: string;
  mpn?: string;
}

interface ValidationResult {
  marketplace: string;
  is_valid: boolean;
  errors: string[];
  warnings: string[];
}

const MarketplacePanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'ebay' | 'amazon'>('overview');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/inventory/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const validateForMarketplace = async (productId: string, marketplace: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8001/api/marketplace/products/${productId}/validate?marketplace=${marketplace}`
      );
      const data = await response.json();
      setValidation(data);
    } catch (error) {
      console.error('Error validating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportProduct = async (productId: string, marketplace: string, format: string = 'csv') => {
    try {
      const response = await fetch(
        `http://localhost:8001/api/marketplace/export/${marketplace}/${productId}?format=${format}`
      );
      
      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${marketplace}_${productId}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        console.log('Export data:', data);
      }
    } catch (error) {
      console.error('Error exporting product:', error);
    }
  };

  const renderOverview = () => (
    <div className="marketplace-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon ebay">
            <ShoppingBag />
          </div>
          <div className="stat-content">
            <h3>eBay</h3>
            <p className="stat-value">{products.filter(p => p.listed_on_ebay).length}</p>
            <p className="stat-label">Listed Products</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon amazon">
            <Package />
          </div>
          <div className="stat-content">
            <h3>Amazon</h3>
            <p className="stat-value">{products.filter(p => p.listed_on_amazon).length}</p>
            <p className="stat-label">Listed Products</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon total">
            <CheckCircle />
          </div>
          <div className="stat-content">
            <h3>Total</h3>
            <p className="stat-value">{products.length}</p>
            <p className="stat-label">Products</p>
          </div>
        </div>
      </div>

      <div className="products-table">
        <h3>Product Listing Status</h3>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Title</th>
              <th>Stock</th>
              <th>Regular Price</th>
              <th>eBay</th>
              <th>Amazon</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.sku}</td>
                <td>{product.title}</td>
                <td>{product.stock_quantity}</td>
                <td>€{product.price_regular?.toFixed(2) || '-'}</td>
                <td>
                  <span className={`status ${product.listed_on_ebay ? 'active' : 'inactive'}`}>
                    {product.listed_on_ebay ? 'Listed' : 'Not Listed'}
                  </span>
                </td>
                <td>
                  <span className={`status ${product.listed_on_amazon ? 'active' : 'inactive'}`}>
                    {product.listed_on_amazon ? 'Listed' : 'Not Listed'}
                  </span>
                </td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() => {
                      setSelectedProduct(product);
                      setActiveTab('ebay');
                    }}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMarketplace = (marketplace: 'ebay' | 'amazon') => (
    <div className="marketplace-detail">
      <div className="marketplace-header">
        <h2>{marketplace === 'ebay' ? 'eBay' : 'Amazon'} Integration</h2>
        <div className="action-buttons">
          <button 
            className="btn-secondary"
            onClick={() => selectedProduct && validateForMarketplace(selectedProduct.id, marketplace)}
          >
            Validate Product
          </button>
          <button 
            className="btn-primary"
            onClick={() => selectedProduct && exportProduct(selectedProduct.id, marketplace)}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {selectedProduct && (
        <div className="product-detail">
          <h3>{selectedProduct.title}</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>SKU:</label>
              <span>{selectedProduct.sku}</span>
            </div>
            <div className="detail-item">
              <label>Brand:</label>
              <span>{selectedProduct.brand}</span>
            </div>
            <div className="detail-item">
              <label>EAN:</label>
              <span>{selectedProduct.ean || 'Not set'}</span>
            </div>
            <div className="detail-item">
              <label>MPN:</label>
              <span>{selectedProduct.mpn || 'Not set'}</span>
            </div>
            <div className="detail-item">
              <label>Stock:</label>
              <span>{selectedProduct.stock_quantity}</span>
            </div>
            <div className="detail-item">
              <label>{marketplace} Price:</label>
              <span>
                €{marketplace === 'ebay' 
                  ? (selectedProduct.price_ebay || selectedProduct.price_regular)?.toFixed(2)
                  : (selectedProduct.price_amazon || selectedProduct.price_regular)?.toFixed(2)
                }
              </span>
            </div>
          </div>
        </div>
      )}

      {validation && validation.marketplace === marketplace && (
        <div className="validation-results">
          <h3>Validation Results</h3>
          {validation.is_valid ? (
            <div className="validation-success">
              <CheckCircle /> Product is ready for {marketplace}
            </div>
          ) : (
            <>
              {validation.errors.length > 0 && (
                <div className="validation-errors">
                  <h4>Errors (must fix):</h4>
                  <ul>
                    {validation.errors.map((error, idx) => (
                      <li key={idx}>
                        <AlertCircle size={16} /> {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {validation.warnings.length > 0 && (
                <div className="validation-warnings">
                  <h4>Warnings (recommended):</h4>
                  <ul>
                    {validation.warnings.map((warning, idx) => (
                      <li key={idx}>
                        <AlertCircle size={16} /> {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="bulk-actions">
        <h3>Bulk Operations</h3>
        <div className="bulk-buttons">
          <button className="btn-outline">
            <Upload size={16} />
            Import Products
          </button>
          <button 
            className="btn-outline"
            onClick={() => exportProduct('bulk', marketplace)}
          >
            <Download size={16} />
            Export All Products
          </button>
          <button className="btn-outline">
            <ExternalLink size={16} />
            Open {marketplace} Seller Center
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="marketplace-panel">
      <div className="panel-header">
        <h1>Marketplace Integration</h1>
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'ebay' ? 'active' : ''}`}
            onClick={() => setActiveTab('ebay')}
          >
            eBay
          </button>
          <button 
            className={`tab ${activeTab === 'amazon' ? 'active' : ''}`}
            onClick={() => setActiveTab('amazon')}
          >
            Amazon
          </button>
        </div>
      </div>

      <div className="panel-content">
        {loading && <div className="loading">Loading...</div>}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'ebay' && renderMarketplace('ebay')}
        {activeTab === 'amazon' && renderMarketplace('amazon')}
      </div>
    </div>
  );
};

export default MarketplacePanel;