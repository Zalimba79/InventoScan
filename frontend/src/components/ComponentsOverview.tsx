import React, { useState } from 'react';
import './ComponentsOverview.css';
import { Card, CardHeader, CardBody, Button, Badge } from './ui';

interface Component {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'beta' | 'coming-soon';
  category: 'capture' | 'management' | 'analytics' | 'tools';
}

const components: Component[] = [
  // Capture
  {
    id: 'mobile-capture',
    name: 'Mobile Capture',
    description: 'Native mobile camera interface for quick inventory capture',
    icon: '📸',
    status: 'active',
    category: 'capture'
  },
  {
    id: 'image-upload',
    name: 'Image Upload',
    description: 'Drag & drop or select images for batch processing',
    icon: '📤',
    status: 'active',
    category: 'capture'
  },
  {
    id: 'barcode-scanner',
    name: 'Barcode Scanner',
    description: 'Scan barcodes and QR codes for instant product lookup',
    icon: '📱',
    status: 'beta',
    category: 'capture'
  },
  
  // Management
  {
    id: 'product-catalog',
    name: 'Product Catalog',
    description: 'Browse, search and manage your complete inventory',
    icon: '📦',
    status: 'active',
    category: 'management'
  },
  {
    id: 'product-wizard',
    name: 'Product Wizard',
    description: 'AI-powered guided product entry with smart suggestions',
    icon: '🧙‍♂️',
    status: 'active',
    category: 'management'
  },
  {
    id: 'inventory-tracker',
    name: 'Inventory Tracker',
    description: 'Real-time stock levels and location tracking',
    icon: '📍',
    status: 'active',
    category: 'management'
  },
  
  // Analytics
  {
    id: 'dashboard',
    name: 'Analytics Dashboard',
    description: 'Comprehensive insights and metrics visualization',
    icon: '📊',
    status: 'active',
    category: 'analytics'
  },
  {
    id: 'reports',
    name: 'Report Generator',
    description: 'Custom reports with export to PDF/Excel',
    icon: '📈',
    status: 'beta',
    category: 'analytics'
  },
  {
    id: 'predictions',
    name: 'Stock Predictions',
    description: 'AI-based demand forecasting and reorder suggestions',
    icon: '🔮',
    status: 'coming-soon',
    category: 'analytics'
  },
  
  // Tools
  {
    id: 'csv-import',
    name: 'CSV Import/Export',
    description: 'Bulk data operations with CSV files',
    icon: '📁',
    status: 'active',
    category: 'tools'
  },
  {
    id: 'label-printer',
    name: 'Label Printer',
    description: 'Generate and print product labels and barcodes',
    icon: '🏷️',
    status: 'beta',
    category: 'tools'
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    description: 'Connect with external systems and marketplaces',
    icon: '🔌',
    status: 'coming-soon',
    category: 'tools'
  }
];

export const ComponentsOverview: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Components', icon: '🎯' },
    { id: 'capture', name: 'Capture', icon: '📸' },
    { id: 'management', name: 'Management', icon: '📦' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'tools', name: 'Tools', icon: '🛠️' }
  ];

  const filteredComponents = components.filter(comp => {
    const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: Component['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'beta':
        return <Badge variant="warning" size="sm">Beta</Badge>;
      case 'coming-soon':
        return <Badge variant="info" size="sm">Coming Soon</Badge>;
    }
  };

  return (
    <div className="components-overview">
      {/* Header */}
      <div className="overview-header">
        <div className="header-content">
          <h1 className="overview-title">Components Overview</h1>
          <p className="overview-subtitle">
            Explore all available features and tools in InventoScan
          </p>
        </div>
        
        <div className="header-search">
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
            <span className="category-count">
              {category.id === 'all' 
                ? components.length 
                : components.filter(c => c.category === category.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Components Grid */}
      <div className="components-grid">
        {filteredComponents.map(component => (
          <Card key={component.id} hoverable className="component-card">
            <CardBody>
              <div className="component-header">
                <span className="component-icon">{component.icon}</span>
                {getStatusBadge(component.status)}
              </div>
              
              <h3 className="component-name">{component.name}</h3>
              <p className="component-description">{component.description}</p>
              
              <div className="component-actions">
                {component.status === 'active' ? (
                  <Button variant="primary" size="sm" fullWidth>
                    Open Component
                  </Button>
                ) : component.status === 'beta' ? (
                  <Button variant="secondary" size="sm" fullWidth>
                    Try Beta
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" fullWidth disabled>
                    Coming Soon
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="overview-stats">
        <Card className="stats-card">
          <CardBody>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{components.filter(c => c.status === 'active').length}</span>
                <span className="stat-label">Active Features</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{components.filter(c => c.status === 'beta').length}</span>
                <span className="stat-label">Beta Features</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{components.filter(c => c.status === 'coming-soon').length}</span>
                <span className="stat-label">Coming Soon</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{components.length}</span>
                <span className="stat-label">Total Components</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Feature Highlights */}
      <div className="feature-highlights">
        <h2 className="highlights-title">Featured Components</h2>
        <div className="highlights-grid">
          <Card className="highlight-card gradient-purple">
            <CardBody>
              <span className="highlight-icon">🚀</span>
              <h3>AI-Powered Product Wizard</h3>
              <p>Intelligent product entry with automatic categorization and smart suggestions</p>
              <Button variant="primary" size="sm">
                Learn More
              </Button>
            </CardBody>
          </Card>
          
          <Card className="highlight-card gradient-blue">
            <CardBody>
              <span className="highlight-icon">📸</span>
              <h3>Mobile-First Capture</h3>
              <p>Native camera integration optimized for quick inventory scanning on any device</p>
              <Button variant="primary" size="sm">
                Learn More
              </Button>
            </CardBody>
          </Card>
          
          <Card className="highlight-card gradient-green">
            <CardBody>
              <span className="highlight-icon">📊</span>
              <h3>Real-Time Analytics</h3>
              <p>Live dashboards with comprehensive insights and predictive analytics</p>
              <Button variant="primary" size="sm">
                Learn More
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};