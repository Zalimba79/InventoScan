import React, { useState } from 'react';
import './DashboardCards.css';

// Icons
const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m4.22-13.22 4.24 4.24M1.54 13.54l4.24 4.24M1.54 10.46l4.24-4.24M10.46 1.54l4.24 4.24"></path>
  </svg>
);

// Additional Icons
const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const TrendingDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
    <polyline points="17 18 23 18 23 12"></polyline>
  </svg>
);

const EuroIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="9.5" cy="7" r="4"></circle>
    <line x1="14" y1="7" x2="21" y2="7"></line>
    <line x1="14" y1="11" x2="21" y2="11"></line>
  </svg>
);

const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

// Card content components
export const ValueOverviewContent = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  return (
    <div className="value-overview-enhanced">
      {/* Period Selector */}
      <div className="period-selector">
        <button 
          className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('week')}
        >
          Woche
        </button>
        <button 
          className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('month')}
        >
          Monat
        </button>
        <button 
          className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('year')}
        >
          Jahr
        </button>
      </div>

      {/* Main Value Display */}
      <div className="value-display">
        <div className="value-icon">
          <EuroIcon />
        </div>
        <div className="value-info">
          <div className="value-amount">€ 24.850</div>
          <div className="value-change positive">
            <TrendingUpIcon />
            <span>+12.5% vs. letzter {selectedPeriod === 'week' ? 'Woche' : selectedPeriod === 'month' ? 'Monat' : 'Jahr'}</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="category-breakdown">
        {[
          { name: 'Elektronik', value: 12400, percentage: 50, color: '#8D7BFB', icon: '💻' },
          { name: 'Möbel', value: 8200, percentage: 33, color: '#3B82F6', icon: '🪑' },
          { name: 'Bücher', value: 2650, percentage: 11, color: '#10B981', icon: '📚' },
          { name: 'Sonstiges', value: 1600, percentage: 6, color: '#F59E0B', icon: '📦' },
        ].map((category, index) => (
          <div key={index} className="category-row">
            <div className="category-icon">{category.icon}</div>
            <div className="category-details">
              <div className="category-header">
                <span className="category-name">{category.name}</span>
                <span className="category-value">€ {category.value.toLocaleString('de-DE')}</span>
              </div>
              <div className="category-bar">
                <div 
                  className="category-bar-fill"
                  style={{ 
                    width: `${category.percentage}%`,
                    background: category.color
                  }}
                />
              </div>
            </div>
            <div className="category-percentage">{category.percentage}%</div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat">
          <span className="stat-label">Wertvollstes Item</span>
          <span className="stat-value">MacBook Pro</span>
        </div>
        <div className="stat">
          <span className="stat-label">Durchschnitt</span>
          <span className="stat-value">€ 168</span>
        </div>
      </div>
    </div>
  );
};

// Props interface for size
interface DailyCaptureProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  cardWidth?: number;
  cardHeight?: number;
}

export const DailyCaptureContent = ({ size = 'md', cardWidth = 4, cardHeight = 3 }: DailyCaptureProps) => {
  const metrics = [
    { 
      value: 47, 
      label: 'Artikel heute', 
      target: 50, 
      color: '#8D7BFB',
      icon: <PackageIcon />,
      shortLabel: 'Artikel'
    },
    { 
      value: 142, 
      label: 'Fotos heute', 
      target: 150, 
      color: '#10B981',
      icon: <CameraIcon />,
      shortLabel: 'Fotos'
    },
    { 
      value: 32, 
      label: 'Ø Zeit (Sek)', 
      target: 30, 
      color: '#3B82F6',
      icon: <ClockIcon />,
      shortLabel: 'Zeit'
    },
    { 
      value: 23, 
      label: 'Offene Items', 
      target: 0, 
      color: '#F59E0B',
      icon: <ClipboardIcon />,
      shortLabel: 'Offen'
    }
  ];

  // Determine actual size based on card dimensions
  const getActualSize = () => {
    if (cardWidth <= 2 && cardHeight <= 2) return 'xs';
    if (cardWidth <= 3 && cardHeight <= 2) return 'sm';
    if (cardWidth <= 6 && cardHeight <= 3) return 'md';
    return 'lg';
  };

  const actualSize = getActualSize();

  // XS Layout - Sehr kompakt (2x2)
  if (actualSize === 'xs') {
    return (
      <div className="daily-capture-xs">
        <div className="capture-summary">
          <div className="main-metric">
            <span className="metric-value-large">{metrics[0].value}</span>
            <span className="metric-label-small">Heute</span>
          </div>
          <div className="progress-ring-small">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="var(--bg-dark-secondary)" strokeWidth="4"/>
              <circle 
                cx="20" cy="20" r="16" 
                fill="none" 
                stroke={metrics[0].color}
                strokeWidth="4"
                strokeDasharray={`${(metrics[0].value / metrics[0].target) * 100} 100`}
                strokeLinecap="round"
                transform="rotate(-90 20 20)"
              />
            </svg>
          </div>
        </div>
        <div className="mini-stats">
          <span className="mini-stat">📸 {metrics[1].value}</span>
          <span className="mini-stat">⏱️ {metrics[2].value}s</span>
        </div>
      </div>
    );
  }

  // SM Layout - Kompakt (3x2)
  if (actualSize === 'sm') {
    return (
      <div className="daily-capture-sm">
        <div className="capture-header-compact">
          <h5>Heute: {metrics[0].value} Items</h5>
          <span className="progress-badge">78%</span>
        </div>
        <div className="metrics-row">
          {metrics.slice(0, 3).map((metric, idx) => (
            <div key={idx} className="metric-compact">
              <div className="metric-icon-small" style={{ color: metric.color }}>
                {metric.icon}
              </div>
              <div className="metric-info-compact">
                <span className="metric-value-compact">{metric.value}</span>
                <span className="metric-label-compact">{metric.shortLabel}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="action-btn-compact">
          + Erfassen
        </button>
      </div>
    );
  }

  // LG Layout - Erweitert (8x4 oder größer)
  if (actualSize === 'lg') {
    return (
      <div className="daily-capture-lg">
        <div className="capture-overview">
          <div className="overview-header">
            <h3>Tagesübersicht</h3>
            <div className="date-display">{new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          </div>
          
          <div className="metrics-dashboard">
            <div className="main-metrics">
              {metrics.map((metric, idx) => (
                <div key={idx} className="metric-card-lg">
                  <div className="metric-header-lg">
                    <div className="metric-icon-lg" style={{ background: `${metric.color}20` }}>
                      {metric.icon}
                    </div>
                    <span className="metric-trend">
                      {metric.value > metric.target ? '↑' : '↓'}
                    </span>
                  </div>
                  <div className="metric-body-lg">
                    <div className="metric-value-lg" style={{ color: metric.color }}>
                      {metric.value}
                    </div>
                    <div className="metric-label-lg">{metric.label}</div>
                    <div className="metric-target">Ziel: {metric.target}</div>
                  </div>
                  <div className="metric-progress-lg">
                    <div 
                      className="progress-fill-lg"
                      style={{ 
                        width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                        background: metric.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="side-panel">
              <div className="timeline">
                <h4>Zeitverlauf</h4>
                <div className="timeline-graph">
                  <svg viewBox="0 0 200 80" style={{ width: '100%', height: '80px' }}>
                    <polyline
                      fill="none"
                      stroke="var(--primary-purple)"
                      strokeWidth="2"
                      points="0,60 25,45 50,50 75,30 100,35 125,25 150,20 175,15 200,10"
                    />
                    <polyline
                      fill="url(#gradient-fill)"
                      fillOpacity="0.2"
                      points="0,60 25,45 50,50 75,30 100,35 125,25 150,20 175,15 200,10 200,80 0,80"
                    />
                    <defs>
                      <linearGradient id="gradient-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#8D7BFB', stopOpacity: 0.5 }} />
                        <stop offset="100%" style={{ stopColor: '#8D7BFB', stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="timeline-labels">
                    <span>8:00</span>
                    <span>12:00</span>
                    <span>16:00</span>
                    <span>20:00</span>
                  </div>
                </div>
              </div>

              <div className="recent-captures">
                <h4>Letzte Erfassungen</h4>
                <div className="capture-list">
                  <div className="capture-item">
                    <span className="capture-time">11:45</span>
                    <span className="capture-name">MacBook Pro</span>
                    <span className="capture-status">✅</span>
                  </div>
                  <div className="capture-item">
                    <span className="capture-time">11:30</span>
                    <span className="capture-name">iPhone 15</span>
                    <span className="capture-status">✅</span>
                  </div>
                  <div className="capture-item">
                    <span className="capture-time">11:15</span>
                    <span className="capture-name">AirPods Pro</span>
                    <span className="capture-status">⏳</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="action-bar">
            <button className="action-btn-primary">
              <CameraIcon />
              Neues Foto
            </button>
            <button className="action-btn-secondary">
              Batch-Import
            </button>
            <button className="action-btn-secondary">
              KI-Analyse
            </button>
            <button className="action-btn-secondary">
              Export
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MD Layout - Standard (4x3) - Default
  return (
    <div className="daily-capture-enhanced">
      {/* Progress Overview */}
      <div className="progress-overview">
        <div className="progress-header">
          <h4>Tagesfortschritt</h4>
          <span className="progress-percentage">78%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: '78%' }} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid-enhanced">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-icon" style={{ color: metric.color }}>
              {metric.icon}
            </div>
            <div className="metric-content">
              <div className="metric-value" style={{ color: metric.color }}>
                {metric.value}
              </div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-progress">
                <div 
                  className="metric-progress-bar"
                  style={{ 
                    width: `${(metric.value / metric.target) * 100}%`,
                    background: metric.color,
                    opacity: 0.3
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="activity-item">
          <div className="activity-time">09:45</div>
          <div className="activity-text">15 neue Artikel erfasst</div>
        </div>
        <div className="activity-item">
          <div className="activity-time">10:30</div>
          <div className="activity-text">Batch-Upload: 42 Fotos</div>
        </div>
        <div className="activity-item">
          <div className="activity-time">11:15</div>
          <div className="activity-text">KI-Analyse abgeschlossen</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-btn primary">
          <CameraIcon />
          <span>Foto aufnehmen</span>
        </button>
        <button className="action-btn secondary">
          <span>Batch-Import</span>
        </button>
      </div>
    </div>
  );
};

export const RecentScansContent = () => {
  const [filter, setFilter] = useState('all');
  
  const scans = [
    { 
      id: 1, 
      name: 'MacBook Pro 16"', 
      category: 'Elektronik', 
      time: 'vor 5 Min', 
      value: '€2,499',
      status: 'complete',
      image: '💻',
      tags: ['Apple', 'Laptop', '2023']
    },
    { 
      id: 2, 
      name: 'Bürostuhl Herman Miller', 
      category: 'Möbel', 
      time: 'vor 12 Min',
      value: '€1,200',
      status: 'processing',
      image: '🪑',
      tags: ['Ergonomisch', 'Premium']
    },
    { 
      id: 3, 
      name: 'iPhone 15 Pro', 
      category: 'Elektronik', 
      time: 'vor 1 Std',
      value: '€1,199',
      status: 'complete',
      image: '📱',
      tags: ['Apple', 'Smartphone']
    },
    { 
      id: 4, 
      name: 'Design Thinking Buch', 
      category: 'Bücher', 
      time: 'vor 2 Std',
      value: '€45',
      status: 'complete',
      image: '📚',
      tags: ['Bildung', 'Design']
    },
    { 
      id: 5, 
      name: 'Sony WH-1000XM5', 
      category: 'Elektronik', 
      time: 'vor 3 Std',
      value: '€379',
      status: 'needs-review',
      image: '🎧',
      tags: ['Audio', 'Premium']
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'complete': return '#10B981';
      case 'processing': return '#3B82F6';
      case 'needs-review': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'complete': return 'Vollständig';
      case 'processing': return 'In Bearbeitung';
      case 'needs-review': return 'Überprüfung nötig';
      default: return 'Unbekannt';
    }
  };

  return (
    <div className="recent-scans-enhanced">
      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Alle
        </button>
        <button 
          className={`filter-tab ${filter === 'today' ? 'active' : ''}`}
          onClick={() => setFilter('today')}
        >
          Heute
        </button>
        <button 
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Ausstehend
        </button>
      </div>

      {/* Scans List */}
      <div className="scans-list-enhanced">
        {scans.map(item => (
          <div key={item.id} className="scan-card">
            <div className="scan-image">{item.image}</div>
            <div className="scan-info">
              <div className="scan-header">
                <h4 className="scan-name">{item.name}</h4>
                <span className="scan-value">{item.value}</span>
              </div>
              <div className="scan-meta">
                <span className="scan-category">{item.category}</span>
                <span className="scan-time">{item.time}</span>
              </div>
              <div className="scan-tags">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="scan-tag">{tag}</span>
                ))}
              </div>
              <div className="scan-status">
                <div 
                  className="status-indicator"
                  style={{ background: getStatusColor(item.status) }}
                />
                <span className="status-text">{getStatusText(item.status)}</span>
              </div>
            </div>
            <div className="scan-actions">
              <button className="scan-action-btn" title="Bearbeiten">
                ✏️
              </button>
              <button className="scan-action-btn" title="Details">
                👁️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="view-all">
        <a href="#" className="view-all-link">
          Alle Scans anzeigen →
        </a>
      </div>
    </div>
  );
};

export const CategoriesContent = () => {
  const categories = [
    { 
      name: 'Elektronik', 
      count: 45, 
      value: '€12,400',
      percentage: 31, 
      color: '#8D7BFB',
      icon: '💻',
      trend: '+5',
      subCategories: ['Computer', 'Smartphones', 'Audio']
    },
    { 
      name: 'Bücher', 
      count: 67, 
      value: '€2,650',
      percentage: 46, 
      color: '#10B981',
      icon: '📚',
      trend: '+12',
      subCategories: ['Fachbücher', 'Romane', 'Comics']
    },
    { 
      name: 'Möbel', 
      count: 23, 
      value: '€8,200',
      percentage: 16, 
      color: '#3B82F6',
      icon: '🪑',
      trend: '+2',
      subCategories: ['Stühle', 'Tische', 'Regale']
    },
    { 
      name: 'Kleidung', 
      count: 34, 
      value: '€3,100',
      percentage: 23, 
      color: '#EC4899',
      icon: '👕',
      trend: '+8',
      subCategories: ['Jacken', 'Schuhe', 'Accessoires']
    },
    { 
      name: 'Sonstiges', 
      count: 12, 
      value: '€1,600',
      percentage: 7, 
      color: '#F59E0B',
      icon: '📦',
      trend: '-1',
      subCategories: ['Diverses']
    }
  ];

  return (
    <div className="categories-enhanced">
      {/* Categories Overview */}
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card">
            <div className="category-icon-wrapper" style={{ background: `${category.color}20` }}>
              <span className="category-icon">{category.icon}</span>
            </div>
            <div className="category-content">
              <div className="category-name">{category.name}</div>
              <div className="category-stats">
                <span className="category-count">{category.count} Items</span>
                <span className="category-trend" style={{ 
                  color: category.trend.startsWith('+') ? '#10B981' : '#EF4444' 
                }}>
                  {category.trend}
                </span>
              </div>
              <div className="category-value">{category.value}</div>
              <div className="category-bar-wrapper">
                <div 
                  className="category-bar"
                  style={{ 
                    width: `${category.percentage}%`,
                    background: category.color
                  }}
                />
              </div>
              <div className="category-subcategories">
                {category.subCategories.slice(0, 2).map((sub, idx) => (
                  <span key={idx} className="subcategory-tag">{sub}</span>
                ))}
                {category.subCategories.length > 2 && (
                  <span className="subcategory-more">+{category.subCategories.length - 2}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="categories-summary">
        <div className="summary-stat">
          <span className="summary-label">Gesamt Items</span>
          <span className="summary-value">181</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Gesamtwert</span>
          <span className="summary-value">€27,950</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Neue diese Woche</span>
          <span className="summary-value">+26</span>
        </div>
      </div>
    </div>
  );
};

export const ActivityContent = () => {
  const [viewMode, setViewMode] = useState('week');
  
  const activityData = {
    week: [
      { day: 'Mo', value: 15, target: 20 },
      { day: 'Di', value: 22, target: 20 },
      { day: 'Mi', value: 18, target: 20 },
      { day: 'Do', value: 35, target: 20 },
      { day: 'Fr', value: 28, target: 20 },
      { day: 'Sa', value: 42, target: 20 },
      { day: 'So', value: 31, target: 20 }
    ]
  };

  const maxValue = Math.max(...activityData.week.map(d => d.value));

  return (
    <div className="activity-enhanced">
      {/* View Mode Selector */}
      <div className="view-mode-selector">
        <button 
          className={`view-mode-btn ${viewMode === 'week' ? 'active' : ''}`}
          onClick={() => setViewMode('week')}
        >
          Woche
        </button>
        <button 
          className={`view-mode-btn ${viewMode === 'month' ? 'active' : ''}`}
          onClick={() => setViewMode('month')}
        >
          Monat
        </button>
      </div>

      {/* Bar Chart */}
      <div className="activity-bar-chart">
        {activityData.week.map((day, index) => (
          <div key={index} className="bar-column">
            <div className="bar-value">{day.value}</div>
            <div className="bar-container">
              <div 
                className="bar-fill"
                style={{ 
                  height: `${(day.value / maxValue) * 100}%`,
                  background: day.value >= day.target 
                    ? 'linear-gradient(180deg, #10B981, #059669)'
                    : 'linear-gradient(180deg, #8D7BFB, #7C3AED)'
                }}
              />
              <div 
                className="bar-target"
                style={{ 
                  bottom: `${(day.target / maxValue) * 100}%`
                }}
              />
            </div>
            <div className="bar-label">{day.day}</div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="activity-statistics">
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">191</div>
            <div className="stat-label">Diese Woche</div>
            <div className="stat-change positive">+23% vs. Vorwoche</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-value">27</div>
            <div className="stat-label">Ø pro Tag</div>
            <div className="stat-change">Ziel: 20</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">42</div>
            <div className="stat-label">Bestwert</div>
            <div className="stat-change">Samstag</div>
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="activity-heatmap">
        <h5>Aktivitäts-Heatmap</h5>
        <div className="heatmap-grid">
          {Array.from({ length: 24 }, (_, hour) => {
            const intensity = Math.random();
            return (
              <div 
                key={hour}
                className="heatmap-cell"
                style={{ 
                  background: `rgba(141, 123, 251, ${intensity})`,
                  opacity: intensity > 0.3 ? 1 : 0.5
                }}
                title={`${hour}:00 - ${Math.floor(intensity * 10)} Scans`}
              />
            );
          })}
        </div>
        <div className="heatmap-labels">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  );
};

export const TasksContent = () => {
  const [filter, setFilter] = useState('all');
  
  const tasks = [
    {
      id: 1,
      type: 'warning',
      icon: '📸',
      title: '5 Items ohne Foto',
      description: 'MacBook Pro, iPhone 15, und 3 weitere',
      action: 'Fotos hinzufügen',
      priority: 'medium',
      dueIn: '2 Tage'
    },
    {
      id: 2,
      type: 'info',
      icon: '🔍',
      title: '3 Items zur Überprüfung',
      description: 'Preisänderungen erkannt',
      action: 'Überprüfen',
      priority: 'low',
      dueIn: 'Diese Woche'
    },
    {
      id: 3,
      type: 'error',
      icon: '💾',
      title: 'Backup überfällig',
      description: 'Letztes Backup vor 14 Tagen',
      action: 'Jetzt sichern',
      priority: 'high',
      dueIn: 'Überfällig'
    },
    {
      id: 4,
      type: 'success',
      icon: '✨',
      title: 'KI-Analyse verfügbar',
      description: '12 neue Items können analysiert werden',
      action: 'Analysieren',
      priority: 'medium',
      dueIn: 'Heute'
    },
    {
      id: 5,
      type: 'warning',
      icon: '📊',
      title: 'Monatsbericht bereit',
      description: 'Oktober 2024 Zusammenfassung',
      action: 'Ansehen',
      priority: 'low',
      dueIn: 'Verfügbar'
    }
  ];

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      case 'info': return '#3B82F6';
      case 'success': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="tasks-enhanced">
      {/* Task Filters */}
      <div className="task-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Alle ({tasks.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'urgent' ? 'active' : ''}`}
          onClick={() => setFilter('urgent')}
        >
          Dringend (2)
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Erledigt (0)
        </button>
      </div>

      {/* Tasks List */}
      <div className="tasks-list-enhanced">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <div 
              className="task-indicator"
              style={{ background: getTypeColor(task.type) }}
            />
            <div className="task-icon">{task.icon}</div>
            <div className="task-content">
              <div className="task-header">
                <h4 className="task-title">{task.title}</h4>
                <span className="task-priority">{getPriorityIcon(task.priority)}</span>
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-footer">
                <span className="task-due">{task.dueIn}</span>
                <button className="task-action-btn">
                  {task.action} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action-btn">
          <span>➕ Neue Aufgabe</span>
        </button>
        <button className="quick-action-btn">
          <span>📅 Kalender</span>
        </button>
      </div>
    </div>
  );
};

// Helper to get card content with size parameters
export const getCardContent = (cardId: string, width?: number, height?: number) => {
  switch (cardId) {
    case 'value-overview':
      return <ValueOverviewContent />;
    case 'daily-capture':
      return <DailyCaptureContent cardWidth={width} cardHeight={height} />;
    case 'recent-scans':
      return <RecentScansContent />;
    case 'categories':
      return <CategoriesContent />;
    case 'activity':
      return <ActivityContent />;
    case 'tasks':
      return <TasksContent />;
    default:
      return <div>Card content</div>;
  }
};

// Helper to get card icon
export const getCardIcon = (cardId: string) => {
  switch (cardId) {
    case 'value-overview':
    case 'daily-capture':
    case 'activity':
      return <ChartIcon />;
    case 'recent-scans':
      return <ClipboardIcon />;
    case 'categories':
      return <FolderIcon />;
    case 'tasks':
      return <BellIcon />;
    default:
      return <ChartIcon />;
  }
};