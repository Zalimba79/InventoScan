import React, { useState, useEffect } from 'react';
import { createSafeImageProps } from '../utils/security';
import './ProductCatalog.css';

interface Product {
  id: string;
  name: string;
  brand: string;
  barcode?: string;
  category?: string;
  stock_quantity: number;
  location?: string;
  price_regular?: number;
  image_url?: string;
  created_at: string;
}

interface ProductCatalogProps {
  onProductSelect?: (productId: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onProductSelect }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for testing
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Einnietmutter Senkkopf M4',
        brand: 'WÜRTH',
        barcode: '4047376706309',
        category: 'Befestigungstechnik',
        stock_quantity: 100,
        location: 'Regal A3',
        price_regular: 45.90,
        created_at: '2024-01-15'
      },
      {
        id: '2',
        name: 'Sechskantschraube DIN 933',
        brand: 'WÜRTH',
        category: 'Schrauben',
        stock_quantity: 500,
        location: 'Regal A4',
        price_regular: 12.50,
        created_at: '2024-01-14'
      },
      {
        id: '3',
        name: 'Unterlegscheibe DIN 125',
        brand: 'Fischer',
        category: 'Scheiben',
        stock_quantity: 1000,
        location: 'Regal B1',
        price_regular: 8.90,
        created_at: '2024-01-13'
      }
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, []);

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.includes(searchTerm)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(product => product.location === selectedLocation);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, selectedLocation, products]);

  // Get unique categories and locations
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
  const locations = ['all', ...new Set(products.map(p => p.location).filter(Boolean))];

  const handleProductClick = (productId: string) => {
    if (onProductSelect) {
      onProductSelect(productId);
    }
  };

  const handleEditClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (onProductSelect) {
      onProductSelect(productId);
    }
  };

  if (loading) {
    return (
      <div className="catalog-loading">
        <div className="spinner"></div>
        <p>Lade Produkte...</p>
      </div>
    );
  }

  return (
    <div className="catalog-container">
      {/* Header with search and filters */}
      <div className="catalog-header">
        <div className="catalog-title">
          <h2>Produktkatalog</h2>
          <span className="product-count">{filteredProducts.length} Produkte</span>
        </div>

        <div className="catalog-controls">
          {/* Search bar */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Suche nach Name, Marke oder Barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="filters">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">Alle Kategorien</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="filter-select"
            >
              <option value="all">Alle Lagerorte</option>
              {locations.slice(1).map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {/* View mode toggle */}
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid-Ansicht"
              >
                ⚏
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Listen-Ansicht"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products grid/list */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>Keine Produkte gefunden</p>
          {searchTerm && (
            <button className="btn-secondary" onClick={() => setSearchTerm('')}>
              Filter zurücksetzen
            </button>
          )}
        </div>
      ) : (
        <div className={`products-${viewMode}`}>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-image">
                {product.image_url ? (
                  <img {...createSafeImageProps(product.image_url || '', product.name)} />
                ) : (
                  <div className="image-placeholder">
                    <span>📦</span>
                  </div>
                )}
                {product.stock_quantity <= 10 && (
                  <span className="stock-warning">Niedriger Bestand</span>
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-brand">{product.brand}</p>
                
                <div className="product-details">
                  <div className="detail-item">
                    <span className="detail-label">Menge:</span>
                    <span className="detail-value">{product.stock_quantity}</span>
                  </div>
                  {product.location && (
                    <div className="detail-item">
                      <span className="detail-label">Ort:</span>
                      <span className="detail-value">{product.location}</span>
                    </div>
                  )}
                  {product.price_regular && (
                    <div className="detail-item">
                      <span className="detail-label">Preis:</span>
                      <span className="detail-value">€{product.price_regular.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {product.barcode && (
                  <div className="product-barcode">
                    <span className="barcode-icon">||| |||</span>
                    <span>{product.barcode}</span>
                  </div>
                )}

                <div className="product-actions">
                  <button
                    className="btn-edit"
                    onClick={(e) => handleEditClick(e, product.id)}
                  >
                    Bearbeiten
                  </button>
                  <button className="btn-view">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};