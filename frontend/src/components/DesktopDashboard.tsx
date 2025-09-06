import React, { useState, useEffect } from 'react';
import './DesktopDashboard.css';

interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  categories: number;
  locations: number;
  recentProducts: Product[];
  categoryBreakdown: CategoryData[];
  stockAlerts: StockAlert[];
  monthlyTrends: TrendData[];
  topProducts: Product[];
  recentActivities: Activity[];
  performanceMetrics: PerformanceData;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  stock_quantity: number;
  price_regular?: number;
  created_at: string;
  image?: string;
  category?: string;
  location?: string;
  turnover_rate?: number;
}

interface CategoryData {
  name: string;
  count: number;
  value: number;
  growth: number;
  icon?: string;
}

interface StockAlert {
  id: string;
  product_name: string;
  current_stock: number;
  min_stock: number;
  location: string;
  urgency: 'high' | 'medium' | 'low';
  days_remaining?: number;
}

interface TrendData {
  month: string;
  products_added: number;
  products_sold: number;
  revenue: number;
  stock_value: number;
}

interface Activity {
  id: string;
  type: 'add' | 'update' | 'delete' | 'sale' | 'restock';
  description: string;
  timestamp: string;
  user?: string;
  product_id?: string;
}

interface PerformanceData {
  inventory_turnover: number;
  average_days_in_stock: number;
  stock_accuracy: number;
  fulfillment_rate: number;
  carrying_cost: number;
  deadstock_percentage: number;
}

export const DesktopDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);

  useEffect(() => {
    // Mock data with desktop-specific features
    const mockStats: DashboardStats = {
      totalProducts: 1247,
      totalValue: 127450.00,
      lowStockItems: 23,
      categories: 12,
      locations: 8,
      recentProducts: [
        {
          id: '1',
          name: 'Einpressmutter Senkkopf M4',
          brand: 'WÜRTH',
          stock_quantity: 100,
          price_regular: 45.90,
          created_at: '2024-01-20',
          category: 'Befestigungstechnik',
          location: 'Regal A1',
          turnover_rate: 3.2
        },
        {
          id: '2',
          name: 'Sechskantschraube DIN 933',
          brand: 'WÜRTH',
          stock_quantity: 500,
          price_regular: 12.50,
          created_at: '2024-01-19',
          category: 'Schrauben',
          location: 'Regal B2',
          turnover_rate: 4.5
        },
        {
          id: '3',
          name: 'Unterlegscheibe DIN 125',
          brand: 'Fischer',
          stock_quantity: 1000,
          price_regular: 8.90,
          created_at: '2024-01-18',
          category: 'Kleinteile',
          location: 'Regal C3',
          turnover_rate: 5.1
        }
      ],
      topProducts: [
        {
          id: '4',
          name: 'Premium Bohrerset HSS',
          brand: 'Bosch',
          stock_quantity: 45,
          price_regular: 89.90,
          category: 'Werkzeuge',
          turnover_rate: 8.3
        },
        {
          id: '5',
          name: 'LED Arbeitsleuchte 50W',
          brand: 'Brennenstuhl',
          stock_quantity: 12,
          price_regular: 156.50,
          category: 'Beleuchtung',
          turnover_rate: 6.7
        }
      ],
      categoryBreakdown: [
        { name: 'Befestigungstechnik', count: 345, value: 45670, growth: 12.3, icon: '🔩' },
        { name: 'Schrauben', count: 289, value: 31200, growth: 8.5, icon: '🔧' },
        { name: 'Werkzeuge', count: 156, value: 28900, growth: -2.1, icon: '🔨' },
        { name: 'Elektronik', count: 234, value: 12450, growth: 15.7, icon: '⚡' },
        { name: 'Beleuchtung', count: 89, value: 9230, growth: 22.4, icon: '💡' }
      ],
      stockAlerts: [
        {
          id: '1',
          product_name: 'Kabelbinder 200mm',
          current_stock: 12,
          min_stock: 50,
          location: 'Regal B2',
          urgency: 'high',
          days_remaining: 3
        },
        {
          id: '2',
          product_name: 'Dübel 8mm',
          current_stock: 45,
          min_stock: 100,
          location: 'Regal A1',
          urgency: 'medium',
          days_remaining: 7
        },
        {
          id: '3',
          product_name: 'Isolierband schwarz',
          current_stock: 8,
          min_stock: 25,
          location: 'Regal C3',
          urgency: 'high',
          days_remaining: 2
        }
      ],
      monthlyTrends: [
        { month: 'Jan', products_added: 120, products_sold: 98, revenue: 12450, stock_value: 118000 },
        { month: 'Feb', products_added: 145, products_sold: 110, revenue: 13890, stock_value: 121000 },
        { month: 'Mar', products_added: 98, products_sold: 125, revenue: 14230, stock_value: 119500 },
        { month: 'Apr', products_added: 167, products_sold: 143, revenue: 15670, stock_value: 124000 },
        { month: 'Mai', products_added: 134, products_sold: 156, revenue: 16890, stock_value: 127450 }
      ],
      recentActivities: [
        {
          id: '1',
          type: 'add',
          description: '50x Einpressmutter M4 hinzugefügt',
          timestamp: '2024-05-20 14:23',
          user: 'Admin'
        },
        {
          id: '2',
          type: 'sale',
          description: 'Verkauf: 10x LED Arbeitsleuchte',
          timestamp: '2024-05-20 13:15',
          user: 'System'
        },
        {
          id: '3',
          type: 'restock',
          description: 'Nachbestellung: Kabelbinder 200mm',
          timestamp: '2024-05-20 11:45',
          user: 'Admin'
        },
        {
          id: '4',
          type: 'update',
          description: 'Preis aktualisiert: Bohrerset HSS',
          timestamp: '2024-05-20 10:30',
          user: 'Manager'
        }
      ],
      performanceMetrics: {
        inventory_turnover: 4.2,
        average_days_in_stock: 87,
        stock_accuracy: 98.5,
        fulfillment_rate: 96.3,
        carrying_cost: 3450.50,
        deadstock_percentage: 2.1
      }
    };

    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="desktop-dashboard-loading">
        <div className="spinner"></div>
        <p>Lade erweiterte Dashboard-Daten...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="desktop-dashboard-error">
        <p>Dashboard konnte nicht geladen werden</p>
      </div>
    );
  }

  return (
    <div className="desktop-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h3>Quick Actions</h3>
        </div>
        
        <div className="quick-actions">
          <button className="action-btn primary">
            <span className="action-icon">➕</span>
            <span>Neues Produkt</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📦</span>
            <span>Inventur starten</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span>Report erstellen</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">⚙️</span>
            <span>Einstellungen</span>
          </button>
        </div>

        <div className="sidebar-section">
          <h4>Lagerorte</h4>
          <ul className="location-list">
            {['Hauptlager', 'Regal A1-A4', 'Regal B1-B4', 'Regal C1-C4', 'Außenlager'].map(loc => (
              <li key={loc} className="location-item">
                <span className="location-icon">📍</span>
                <span>{loc}</span>
                <span className="location-count">124</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h4>Schnellfilter</h4>
          <div className="filter-tags">
            <span className="filter-tag active">Alle</span>
            <span className="filter-tag">Niedriger Bestand</span>
            <span className="filter-tag">Hoher Wert</span>
            <span className="filter-tag">Neu hinzugefügt</span>
            <span className="filter-tag">Bestseller</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header-desktop">
          <div className="header-content">
            <div>
              <h1 className="dashboard-title">Enterprise Dashboard</h1>
              <p className="dashboard-subtitle">
                Letztes Update: {new Date().toLocaleString('de-DE')} | 
                <span className="status-indicator online"> System Online</span>
              </p>
            </div>
            <div className="header-actions">
              <div className="time-range-selector-desktop">
                <button 
                  className={timeRange === 'day' ? 'active' : ''}
                  onClick={() => setTimeRange('day')}
                >
                  Tag
                </button>
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
                  className={timeRange === 'quarter' ? 'active' : ''}
                  onClick={() => setTimeRange('quarter')}
                >
                  Quartal
                </button>
                <button 
                  className={timeRange === 'year' ? 'active' : ''}
                  onClick={() => setTimeRange('year')}
                >
                  Jahr
                </button>
              </div>
              <button className="btn-export">
                <span>📥</span> Export
              </button>
              <button 
                className="btn-analytics"
                onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
              >
                <span>📈</span> {showAdvancedAnalytics ? 'Basis' : 'Erweitert'}
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid-desktop">
          <div className="kpi-card primary">
            <div className="kpi-header">
              <span className="kpi-icon">📦</span>
              <span className="kpi-trend positive">+12.3%</span>
            </div>
            <div className="kpi-value">{stats.totalProducts.toLocaleString('de-DE')}</div>
            <div className="kpi-label">Gesamte Produkte</div>
            <div className="kpi-chart">
              <div className="mini-chart"></div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-icon">💰</span>
              <span className="kpi-trend positive">+8.5%</span>
            </div>
            <div className="kpi-value">€{stats.totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</div>
            <div className="kpi-label">Lagerwert</div>
            <div className="kpi-chart">
              <div className="mini-chart"></div>
            </div>
          </div>

          <div className="kpi-card alert">
            <div className="kpi-header">
              <span className="kpi-icon">⚠️</span>
              <span className="kpi-trend negative">Kritisch</span>
            </div>
            <div className="kpi-value">{stats.lowStockItems}</div>
            <div className="kpi-label">Niedriger Bestand</div>
            <div className="kpi-subcards">
              <span className="urgent-count">5 Dringend</span>
              <span className="warning-count">18 Warnung</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-icon">🔄</span>
              <span className="kpi-value-small">{stats.performanceMetrics.inventory_turnover}x</span>
            </div>
            <div className="kpi-value">{stats.performanceMetrics.average_days_in_stock}</div>
            <div className="kpi-label">⌀ Tage im Lager</div>
            <div className="kpi-progress">
              <div className="progress-bar" style={{width: '65%'}}></div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-icon">📊</span>
              <span className="kpi-value-small">{stats.performanceMetrics.stock_accuracy}%</span>
            </div>
            <div className="kpi-value">{stats.performanceMetrics.fulfillment_rate}%</div>
            <div className="kpi-label">Erfüllungsrate</div>
            <div className="kpi-progress">
              <div className="progress-bar success" style={{width: '96.3%'}}></div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-icon">📍</span>
              <span className="kpi-badge">{stats.categories}</span>
            </div>
            <div className="kpi-value">{stats.locations}</div>
            <div className="kpi-label">Lagerorte</div>
            <div className="kpi-mini-list">
              <span>A: 345</span>
              <span>B: 412</span>
              <span>C: 490</span>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Section (Desktop Only) */}
        {showAdvancedAnalytics && (
          <div className="advanced-analytics">
            <div className="analytics-card">
              <h3>Inventory Heatmap</h3>
              <div className="heatmap-container">
                <div className="heatmap-grid">
                  {Array.from({length: 48}, (_, i) => (
                    <div 
                      key={i} 
                      className="heatmap-cell"
                      style={{backgroundColor: `rgba(99, 102, 241, ${Math.random()})`}}
                      title={`Zone ${i+1}`}
                    ></div>
                  ))}
                </div>
                <div className="heatmap-legend">
                  <span>Niedrig</span>
                  <div className="legend-gradient"></div>
                  <span>Hoch</span>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h3>ABC-Analyse</h3>
              <div className="abc-analysis">
                <div className="abc-item a-class">
                  <span className="abc-label">A-Produkte (80% Umsatz)</span>
                  <div className="abc-bar" style={{width: '20%'}}>20%</div>
                </div>
                <div className="abc-item b-class">
                  <span className="abc-label">B-Produkte (15% Umsatz)</span>
                  <div className="abc-bar" style={{width: '30%'}}>30%</div>
                </div>
                <div className="abc-item c-class">
                  <span className="abc-label">C-Produkte (5% Umsatz)</span>
                  <div className="abc-bar" style={{width: '50%'}}>50%</div>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Vorhersage-Modell</h3>
              <div className="prediction-chart">
                <p>Bestandsprognose für die nächsten 30 Tage</p>
                <div className="chart-placeholder">
                  [Interaktives Chart würde hier erscheinen]
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid-desktop">
          {/* Trends Chart */}
          <div className="dashboard-card chart-card">
            <div className="card-header">
              <h3>Umsatz & Lagerbestand Trend</h3>
              <div className="chart-controls">
                <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
                  <option value="revenue">Umsatz</option>
                  <option value="stock">Lagerbestand</option>
                  <option value="both">Beide</option>
                </select>
              </div>
            </div>
            <div className="chart-container-desktop">
              <div className="trend-chart">
                {stats.monthlyTrends.map((trend, i) => (
                  <div key={i} className="chart-bar-group">
                    <div className="chart-bar" style={{height: `${(trend.revenue/200)}px`}}>
                      <span className="bar-tooltip">€{trend.revenue}</span>
                    </div>
                    <span className="chart-label">{trend.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Kategorien Performance</h3>
              <button className="btn-icon">⚙️</button>
            </div>
            <div className="category-performance">
              {stats.categoryBreakdown.map(cat => (
                <div key={cat.name} className="category-row">
                  <div className="category-info">
                    <span className="category-icon">{cat.icon}</span>
                    <div>
                      <div className="category-name">{cat.name}</div>
                      <div className="category-stats">
                        <span>{cat.count} Artikel</span>
                        <span>€{cat.value.toLocaleString('de-DE')}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`category-growth ${cat.growth > 0 ? 'positive' : 'negative'}`}>
                    {cat.growth > 0 ? '↑' : '↓'} {Math.abs(cat.growth)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Top Produkte (Turnover Rate)</h3>
              <span className="card-badge">Live</span>
            </div>
            <div className="top-products">
              {stats.topProducts.map((product, i) => (
                <div key={product.id} className="top-product-item">
                  <div className="rank">#{i + 1}</div>
                  <div className="product-info-desktop">
                    <div className="product-name">{product.name}</div>
                    <div className="product-meta">
                      <span>{product.brand}</span>
                      <span>{product.category}</span>
                      <span className="turnover-rate">↻ {product.turnover_rate}x/Monat</span>
                    </div>
                  </div>
                  <div className="product-value">
                    €{product.price_regular?.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Alerts with Priority */}
          <div className="dashboard-card alerts-card">
            <div className="card-header">
              <h3>Bestandswarnungen</h3>
              <div className="alert-filters">
                <button className="filter-btn active">Alle</button>
                <button className="filter-btn">Kritisch</button>
                <button className="filter-btn">Warnung</button>
              </div>
            </div>
            <div className="alert-list-desktop">
              {stats.stockAlerts.map(alert => (
                <div key={alert.id} className={`alert-item urgency-${alert.urgency}`}>
                  <div className="alert-indicator"></div>
                  <div className="alert-content">
                    <div className="alert-product">{alert.product_name}</div>
                    <div className="alert-details">
                      <span className="alert-stock">
                        {alert.current_stock}/{alert.min_stock}
                      </span>
                      <span className="alert-location">{alert.location}</span>
                      {alert.days_remaining && (
                        <span className="alert-days">
                          {alert.days_remaining} Tage verbleibend
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="btn-order">Bestellen</button>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="dashboard-card activity-card">
            <div className="card-header">
              <h3>Aktivitäten</h3>
              <button className="btn-refresh">🔄</button>
            </div>
            <div className="activity-feed">
              {stats.recentActivities.map(activity => (
                <div key={activity.id} className={`activity-item type-${activity.type}`}>
                  <div className="activity-icon">
                    {activity.type === 'add' && '➕'}
                    {activity.type === 'sale' && '💰'}
                    {activity.type === 'restock' && '📦'}
                    {activity.type === 'update' && '✏️'}
                    {activity.type === 'delete' && '🗑️'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-description">{activity.description}</div>
                    <div className="activity-meta">
                      <span className="activity-time">{activity.timestamp}</span>
                      {activity.user && <span className="activity-user">von {activity.user}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-view-all">Alle Aktivitäten anzeigen →</button>
          </div>
        </div>
      </main>

      {/* Right Panel (Desktop Only) */}
      <aside className="dashboard-right-panel">
        <div className="panel-section">
          <h4>Performance Metriken</h4>
          <div className="metric-tiles">
            <div className="metric-tile">
              <div className="metric-label">Genauigkeit</div>
              <div className="metric-value">{stats.performanceMetrics.stock_accuracy}%</div>
            </div>
            <div className="metric-tile">
              <div className="metric-label">Totbestand</div>
              <div className="metric-value">{stats.performanceMetrics.deadstock_percentage}%</div>
            </div>
            <div className="metric-tile">
              <div className="metric-label">Lagerkosten</div>
              <div className="metric-value">€{stats.performanceMetrics.carrying_cost}</div>
            </div>
          </div>
        </div>

        <div className="panel-section">
          <h4>Schnellzugriff</h4>
          <div className="quick-links">
            <a href="#" className="quick-link">📊 Vollständiger Report</a>
            <a href="#" className="quick-link">📦 Bestellvorschläge</a>
            <a href="#" className="quick-link">🏷️ Preisanpassungen</a>
            <a href="#" className="quick-link">📋 Inventurliste</a>
          </div>
        </div>

        <div className="panel-section">
          <h4>Systemstatus</h4>
          <div className="system-status">
            <div className="status-item">
              <span className="status-dot online"></span>
              <span>Datenbank: Online</span>
            </div>
            <div className="status-item">
              <span className="status-dot online"></span>
              <span>API: Aktiv</span>
            </div>
            <div className="status-item">
              <span className="status-dot sync"></span>
              <span>Sync: Läuft...</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};