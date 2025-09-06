import React, { useState, useEffect } from 'react';
import './MobileDashboard.css';

interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  recentScans: number;
  productsChange: number;
  valueChange: number;
  categories: number;
}

export const MobileDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 1247,
    totalValue: 127450.00,
    lowStockItems: 23,
    recentScans: 47,
    productsChange: 12,
    valueChange: 8.3,
    categories: 15
  });

  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
    return formatted + ' €';
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE').format(value);
  };

  return (
    <div className="mobile-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Inventar Dashboard</h1>
          <p className="subtitle">Übersicht über Ihr Lager</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="time-selector">
          <button 
            className={timeRange === 'week' ? 'active' : ''}
            onClick={() => setTimeRange('week')}
          >
            Woche
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            Monat
          </button>
          <button 
            className={timeRange === 'year' ? 'active' : ''}
            onClick={() => setTimeRange('year')}
          >
            Jahr
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="stats-grid">
        {/* Total Products Card */}
        <div className="stat-card primary">
          <div className="stat-icon">
            📦
          </div>
          <div className="stat-content">
            <span className="stat-label">Gesamte Produkte</span>
            <div className="stat-value">{formatNumber(stats.totalProducts)}</div>
            <div className="stat-change positive">
              +{stats.productsChange}% vs. letzter<br/>
              {timeRange === 'week' ? 'Woche' : timeRange === 'month' ? 'Monat' : 'Jahr'}
            </div>
          </div>
        </div>

        {/* Total Value Card */}
        <div className="stat-card secondary">
          <div className="stat-icon">
            💰
          </div>
          <div className="stat-content">
            <span className="stat-label">Gesamtwert</span>
            <div className="stat-value">{formatCurrency(stats.totalValue)}</div>
            <div className="stat-change positive">
              +{stats.valueChange}% vs. letzter<br/>
              {timeRange === 'week' ? 'Woche' : timeRange === 'month' ? 'Monat' : 'Jahr'}
            </div>
          </div>
        </div>

        {/* Low Stock Alert Card */}
        <div className="stat-card warning">
          <div className="stat-icon">
            ⚠️
          </div>
          <div className="stat-content">
            <span className="stat-label">Niedriger Bestand</span>
            <div className="stat-value">{stats.lowStockItems}</div>
            <div className="stat-change negative">
              Sofort prüfen
            </div>
          </div>
        </div>

        {/* Recent Scans Card */}
        <div className="stat-card info">
          <div className="stat-icon">
            📈
          </div>
          <div className="stat-content">
            <span className="stat-label">Heutige Scans</span>
            <div className="stat-value">{stats.recentScans}</div>
            <div className="stat-change neutral">
              Letzte vor 5 Min.
            </div>
          </div>
        </div>
      </div>


      {/* Categories Overview */}
      <div className="categories-section">
        <div className="section-header">
          <h2>Kategorien</h2>
          <button className="see-all">Alle anzeigen</button>
        </div>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-icon electronics">📱</div>
            <span className="category-name">Elektronik</span>
            <span className="category-count">342</span>
          </div>
          <div className="category-card">
            <div className="category-icon furniture">🪑</div>
            <span className="category-name">Möbel</span>
            <span className="category-count">156</span>
          </div>
          <div className="category-card">
            <div className="category-icon tools">🔧</div>
            <span className="category-name">Werkzeuge</span>
            <span className="category-count">289</span>
          </div>
          <div className="category-card">
            <div className="category-icon office">📎</div>
            <span className="category-name">Büro</span>
            <span className="category-count">198</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="section-header">
          <h2>Letzte Aktivitäten</h2>
          <button className="see-all">Alle anzeigen</button>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon added">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="activity-details">
              <span className="activity-title">MacBook Pro 14" hinzugefügt</span>
              <span className="activity-time">vor 5 Minuten</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon scanned">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="activity-details">
              <span className="activity-title">15 Artikel gescannt</span>
              <span className="activity-time">vor 1 Stunde</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="activity-details">
              <span className="activity-title">Niedriger Bestand: USB-Kabel</span>
              <span className="activity-time">vor 2 Stunden</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};