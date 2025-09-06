import React, { useState } from 'react';
import '../styles/design-tokens.css';
import './Dashboard.css';

// Icons
const DoubleArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="13 17 18 12 13 7"></polyline>
    <polyline points="6 17 11 12 6 7"></polyline>
  </svg>
);

const DoubleArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="11 17 6 12 11 7"></polyline>
    <polyline points="18 17 13 12 18 7"></polyline>
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m4.22-13.22 4.24 4.24M1.54 13.54l4.24 4.24M1.54 10.46l4.24-4.24M10.46 1.54l4.24 4.24"></path>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const PaletteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export const Dashboard: React.FC = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeNav, setActiveNav] = useState('questionnaire');
  const [currentView, setCurrentView] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'questionnaire', label: 'Your CDP Questionnaire', icon: <ClipboardIcon />, badge: '+2' },
    { id: 'reports', label: 'Reports', icon: <ChartIcon /> },
    { id: 'documents', label: 'Documents', icon: <FolderIcon /> },
    { id: 'background', label: 'Background Preview', icon: <EyeIcon /> },
    { id: 'design', label: 'Design System', icon: <PaletteIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (id === 'design') {
      setCurrentView('design');
    } else if (id === 'background') {
      setCurrentView('background');
    } else {
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="dashboard gradient-subtle">
      {/* Header - Durchgehend */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">
              <img src="/logo.png" alt="InventoScan" style={{ width: '130%', height: '130%', objectFit: 'contain' }} />
            </div>
            <span className="logo-text">
              Invento<span style={{ color: 'var(--primary-purple)' }}>Scan</span>
            </span>
          </div>
        </div>
        
        <div className="header-center">
          {/* Platz für zukünftige Elemente */}
        </div>
        
        <div className="header-right">
          <div className="header-actions">
            <button className="header-icon-button notification">
              <span className="icon-circle">
                <BellIcon />
              </span>
              <span className="badge-text">+4</span>
            </button>
            <button className="header-icon-button">
              <span className="icon-circle profile">
                <UserIcon />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>

          <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              title={!sidebarExpanded ? item.label : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarExpanded && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </>
              )}
              {!sidebarExpanded && item.badge && (
                <span className="nav-badge-dot"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="nav-item" 
            onClick={toggleSidebar}
            title={sidebarExpanded ? "Collapse" : "Expand"}
          >
            <span className="nav-icon">
              {sidebarExpanded ? <DoubleArrowLeftIcon /> : <DoubleArrowRightIcon />}
            </span>
          </button>
        </div>
        </aside>

        {/* Main Content */}
        <div className="dashboard-content">

        {/* Main Content Area */}
        <main className="main-content">
          {/* Search Bar - now inside main content */}
          <div className="search-section">
            <div className="search-container">
              <SearchIcon />
              <input 
                type="text" 
                placeholder="Search by..."
                className="search-input"
              />
            </div>
            
            <div className="search-actions">
              <button className="header-button primary" title="Add Photo">
                <CameraIcon />
                <span style={{ marginLeft: '8px' }}>Add Photo</span>
              </button>
            </div>
          </div>
          {currentView === 'background' ? (
            <div className="background-preview">
              <div className="preview-controls">
                <h2>Mesh Gradient Background</h2>
                <div className="gradient-options">
                  <button 
                    className="gradient-button active"
                    onClick={(e) => {
                      const dashboard = document.querySelector('.dashboard');
                      dashboard?.classList.remove('gradient-full', 'gradient-animated');
                      dashboard?.classList.add('gradient-subtle');
                      document.querySelectorAll('.gradient-button').forEach(btn => btn.classList.remove('active'));
                      e.currentTarget.classList.add('active');
                      console.log('Gradient set to SUBTLE - Classes:', dashboard?.className);
                    }}
                  >
                    Subtle (Default)
                  </button>
                  <button 
                    className="gradient-button"
                    onClick={(e) => {
                      const dashboard = document.querySelector('.dashboard');
                      dashboard?.classList.remove('gradient-subtle', 'gradient-animated');
                      dashboard?.classList.add('gradient-full');
                      document.querySelectorAll('.gradient-button').forEach(btn => btn.classList.remove('active'));
                      e.currentTarget.classList.add('active');
                      console.log('Gradient set to FULL - Classes:', dashboard?.className);
                      console.log('Computed background:', window.getComputedStyle(dashboard!).background);
                    }}
                  >
                    Full Intensity
                  </button>
                  <button 
                    className="gradient-button"
                    onClick={(e) => {
                      document.querySelector('.dashboard')?.classList.remove('gradient-subtle', 'gradient-full');
                      document.querySelector('.dashboard')?.classList.add('gradient-animated');
                      document.querySelectorAll('.gradient-button').forEach(btn => btn.classList.remove('active'));
                      e.currentTarget.classList.add('active');
                    }}
                  >
                    Animated
                  </button>
                  <button 
                    className="gradient-button"
                    onClick={() => {
                      document.querySelector('.dashboard')?.classList.toggle('no-overlay');
                    }}
                  >
                    Toggle Overlay
                  </button>
                </div>
                
                <div className="gradient-colors">
                  <h3>Gradient Farben</h3>
                  <div className="color-palette">
                    <div className="color-swatch" style={{ background: '#00D4FF' }}>
                      <span>Cyan</span>
                    </div>
                    <div className="color-swatch" style={{ background: '#7B61FF' }}>
                      <span>Violett</span>
                    </div>
                    <div className="color-swatch" style={{ background: '#FF006E' }}>
                      <span>Pink</span>
                    </div>
                    <div className="color-swatch" style={{ background: '#FF4500' }}>
                      <span>Orange</span>
                    </div>
                    <div className="color-swatch" style={{ background: '#FF69B4' }}>
                      <span>Hot Pink</span>
                    </div>
                  </div>
                </div>
                
                <div className="gradient-info">
                  <p>Aurora-inspirierter Mesh Gradient mit sanften Übergängen</p>
                  <p>Optimiert für dunkle Interfaces mit hohem Kontrast</p>
                </div>
              </div>
            </div>
          ) : currentView === 'dashboard' ? (
            <div className="content-grid">
              {/* Wert-Übersicht Card - kompakt */}
              <div className="status-card value-card compact">
                <div className="card-header">
                  <h3 className="card-title">Wert-Übersicht</h3>
                  <span className="card-icon premium">
                    <ChartIcon />
                  </span>
                </div>
                
                <div className="value-metrics">
                  <div className="value-main">
                    <span className="value-amount">€ 24.850</span>
                    <span className="value-label">Gesamtwert</span>
                  </div>
                  
                  <div className="value-breakdown">
                    <div className="breakdown-item">
                      <span className="breakdown-label">Elektronik</span>
                      <span className="breakdown-value">€ 12.400</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">Möbel</span>
                      <span className="breakdown-value">€ 8.200</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">Sonstiges</span>
                      <span className="breakdown-value">€ 4.250</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Erfassungsstatus Card */}
              <div className="status-card">
                <div className="card-header">
                  <h3 className="card-title">Heutige Erfassung</h3>
                  <span className="card-icon">
                    <ChartIcon />
                  </span>
                </div>
                
                <div className="metrics-grid">
                  <div className="metric-item">
                    <div className="metric-ring">
                      <svg viewBox="0 0 36 36" className="circular-chart">
                        <path className="circle-bg"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className="circle"
                          strokeDasharray="78, 100"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" className="percentage">47</text>
                      </svg>
                    </div>
                    <span className="metric-label">Artikel heute</span>
                  </div>
                  <div className="metric-item">
                    <div className="metric-ring">
                      <svg viewBox="0 0 36 36" className="circular-chart green">
                        <path className="circle-bg"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className="circle"
                          strokeDasharray="95, 100"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" className="percentage">142</text>
                      </svg>
                    </div>
                    <span className="metric-label">Fotos heute</span>
                  </div>
                  <div className="metric-item">
                    <div className="metric-ring">
                      <svg viewBox="0 0 36 36" className="circular-chart blue">
                        <path className="circle-bg"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className="circle"
                          strokeDasharray="32, 100"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" className="percentage">32s</text>
                      </svg>
                    </div>
                    <span className="metric-label">Zeit pro Artikel</span>
                  </div>
                  <div className="metric-item">
                    <div className="metric-ring">
                      <svg viewBox="0 0 36 36" className="circular-chart orange">
                        <path className="circle-bg"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className="circle"
                          strokeDasharray="46, 100"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" className="percentage">23</text>
                      </svg>
                    </div>
                    <span className="metric-label">Offene Analysen</span>
                  </div>
                </div>
                
                <button className="card-action-button">
                  Weiter erfassen
                </button>
              </div>

              {/* Letzte Scans Card */}
              <div className="status-card recent-scans-card">
                <div className="card-header">
                  <h3 className="card-title">Letzte Scans</h3>
                  <span className="card-icon">
                    <ClipboardIcon />
                  </span>
                </div>
                
                <div className="scans-list">
                  {[
                    { id: 1, name: 'MacBook Pro 16"', category: 'Elektronik', time: 'vor 5 Min', color: '#8D7BFB' },
                    { id: 2, name: 'Bürostuhl Herman Miller', category: 'Möbel', time: 'vor 12 Min', color: '#3B82F6' },
                    { id: 3, name: 'iPhone 15 Pro', category: 'Elektronik', time: 'vor 1 Std', color: '#8D7BFB' },
                    { id: 4, name: 'Design Thinking Buch', category: 'Bücher', time: 'vor 2 Std', color: '#10B981' },
                    { id: 5, name: 'Sony WH-1000XM5', category: 'Elektronik', time: 'vor 3 Std', color: '#8D7BFB' },
                  ].map(item => (
                    <div key={item.id} className="scan-item">
                      <div className="scan-thumbnail" style={{ background: item.color }}>
                        <FolderIcon />
                      </div>
                      <div className="scan-details">
                        <span className="scan-name">{item.name}</span>
                        <span className="scan-meta">{item.category} • {item.time}</span>
                      </div>
                      <div className="scan-actions">
                        <button className="action-btn" title="Edit">
                          <SettingsIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kategorien Card */}
              <div className="status-card categories-card">
                <div className="card-header">
                  <h3 className="card-title">Kategorien-Übersicht</h3>
                  <span className="card-icon">
                    <FolderIcon />
                  </span>
                </div>
                
                <div className="categories-list">
                  {[
                    { name: 'Elektronik', count: 45, percentage: 31, color: '#8D7BFB' },
                    { name: 'Bücher', count: 67, percentage: 46, color: '#10B981' },
                    { name: 'Möbel', count: 23, percentage: 16, color: '#3B82F6' },
                    { name: 'Sonstiges', count: 12, percentage: 7, color: '#F59E0B' },
                  ].map(category => (
                    <div key={category.name} className="category-item">
                      <div className="category-info">
                        <div className="category-header">
                          <span className="category-name">{category.name}</span>
                          <span className="category-count">{category.count} Items</span>
                        </div>
                        <div className="category-progress">
                          <div 
                            className="category-progress-fill" 
                            style={{ 
                              width: `${category.percentage}%`,
                              background: category.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="categories-total">
                  <span className="total-label">Gesamt</span>
                  <span className="total-count">147 Items</span>
                </div>
              </div>

              {/* Scan-Aktivität Card */}
              <div className="status-card activity-card">
                <div className="card-header">
                  <h3 className="card-title">Scan-Aktivität</h3>
                  <span className="card-icon">
                    <ChartIcon />
                  </span>
                </div>
                
                <div className="activity-chart">
                  <svg viewBox="0 0 300 100" className="line-chart">
                    <polyline
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      points="0,80 50,65 100,70 150,40 200,45 250,20 300,35"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#8D7BFB', stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: '#A593FF', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="chart-labels">
                    <span>Mo</span>
                    <span>Di</span>
                    <span>Mi</span>
                    <span>Do</span>
                    <span>Fr</span>
                    <span>Sa</span>
                    <span>So</span>
                  </div>
                </div>
                
                <div className="activity-stats">
                  <div className="stat-item">
                    <span className="stat-value">+23%</span>
                    <span className="stat-label">Diese Woche</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">312</span>
                    <span className="stat-label">Gesamt Scans</span>
                  </div>
                </div>
              </div>



              {/* Aufgaben & Erinnerungen Card */}
              <div className="status-card tasks-card">
                <div className="card-header">
                  <h3 className="card-title">Aufgaben & Erinnerungen</h3>
                  <span className="card-icon">
                    <BellIcon />
                  </span>
                </div>
                
                <div className="tasks-list">
                  <div className="task-item warning">
                    <div className="task-indicator"></div>
                    <div className="task-content">
                      <span className="task-title">5 Items ohne Foto</span>
                      <span className="task-action">Fotos hinzufügen</span>
                    </div>
                  </div>
                  <div className="task-item info">
                    <div className="task-indicator"></div>
                    <div className="task-content">
                      <span className="task-title">3 Items zur Überprüfung</span>
                      <span className="task-action">Überprüfen</span>
                    </div>
                  </div>
                  <div className="task-item error">
                    <div className="task-indicator"></div>
                    <div className="task-content">
                      <span className="task-title">Backup überfällig</span>
                      <span className="task-action">Jetzt sichern</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="design-system">
              <h2 className="design-title">InventoScan Design System</h2>
              
              <div className="design-section">
                <h3 className="section-title">Primary Colors</h3>
                <div className="color-grid">
                  <div className="color-item">
                    <div className="color-box" style={{ background: '#8D7BFB' }}></div>
                    <span className="color-label">Primary Purple</span>
                    <span className="color-code">#8D7BFB</span>
                  </div>
                  <div className="color-item">
                    <div className="color-box" style={{ background: '#7C6AEA' }}></div>
                    <span className="color-label">Purple Hover</span>
                    <span className="color-code">#7C6AEA</span>
                  </div>
                  <div className="color-item">
                    <div className="color-box" style={{ background: '#A593FF' }}></div>
                    <span className="color-label">Purple Light</span>
                    <span className="color-code">#A593FF</span>
                  </div>
                  <div className="color-item">
                    <div className="color-box" style={{ background: '#110922' }}></div>
                    <span className="color-label">Dark Primary</span>
                    <span className="color-code">#110922</span>
                  </div>
                  <div className="color-item">
                    <div className="color-box" style={{ background: '#1A0F2E' }}></div>
                    <span className="color-label">Dark Secondary</span>
                    <span className="color-code">#1A0F2E</span>
                  </div>
                  <div className="color-item">
                    <div className="color-box" style={{ background: '#241940' }}></div>
                    <span className="color-label">Dark Tertiary</span>
                    <span className="color-code">#241940</span>
                  </div>
                  <div className="color-item">
                    <div className="color-box" style={{ background: '#1E1333' }}></div>
                    <span className="color-label">Card Background</span>
                    <span className="color-code">#1E1333</span>
                  </div>
                  <div className="color-item">
                    <div className="color-box" style={{ background: '#261A40' }}></div>
                    <span className="color-label">Card Hover</span>
                    <span className="color-code">#261A40</span>
                  </div>
                </div>
              </div>

              <div className="design-section">
                <h3 className="section-title">Status Colors</h3>
                <div className="color-grid">
                  <div className="color-item">
                    <div className="color-box" style={{ background: '#4ADE80' }}></div>
                    <span className="color-label">Success</span>
                    <span className="color-code">#4ADE80</span>
                  </div>
                  <div className="color-item">
                    <div className="color-box" style={{ background: '#FBBF24' }}></div>
                    <span className="color-label">Warning</span>
                    <span className="color-code">#FBBF24</span>
                  </div>
                  <div className="color-item">
                    <div className="color-box" style={{ background: '#EF4444' }}></div>
                    <span className="color-label">Error</span>
                    <span className="color-code">#EF4444</span>
                  </div>
                  <div className="color-item">
                    <div className="color-box" style={{ background: '#3B82F6' }}></div>
                    <span className="color-label">Info</span>
                    <span className="color-code">#3B82F6</span>
                  </div>
                </div>
              </div>

              <div className="design-section">
                <h3 className="section-title">Gradients</h3>
                <div className="gradient-grid">
                  <div className="gradient-item">
                    <div className="gradient-box" style={{ background: 'linear-gradient(135deg, #8D7BFB 0%, #5D4FB8 100%)' }}></div>
                    <span className="gradient-label">Purple Gradient</span>
                  </div>
                  <div className="gradient-item">
                    <div className="gradient-box" style={{ background: 'linear-gradient(135deg, #8D7BFB 0%, #A593FF 100%)' }}></div>
                    <span className="gradient-label">Purple Button</span>
                  </div>
                  <div className="gradient-item">
                    <div className="gradient-box" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }}></div>
                    <span className="gradient-label">Primary Button</span>
                  </div>
                  <div className="gradient-item">
                    <div className="gradient-box" style={{ 
                      background: 'radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.4) 0%, transparent 60%), #110922' 
                    }}></div>
                    <span className="gradient-label">Mesh Gradient</span>
                  </div>
                </div>
              </div>

              <div className="design-section">
                <h3 className="section-title">Buttons</h3>
                <div className="button-showcase">
                  <button className="header-button primary">Primary Gradient</button>
                  <button className="card-action-button">Action Button</button>
                  <button className="header-button">Secondary</button>
                  <button className="action-button">Ghost Button</button>
                  <button className="nav-item" style={{ width: 'auto', padding: '10px 20px' }}>
                    <span className="nav-icon"><HomeIcon /></span>
                    <span>Nav Item</span>
                  </button>
                </div>
              </div>

              <div className="design-section">
                <h3 className="section-title">Spacing System</h3>
                <div className="spacing-showcase">
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20].map(space => (
                    <div key={space} className="spacing-item">
                      <div className="spacing-box" style={{ 
                        width: `${space * 4}px`, 
                        height: '24px', 
                        background: 'var(--primary-purple)' 
                      }}></div>
                      <span className="spacing-label">space-{space} ({space * 4}px)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="design-section">
                <h3 className="section-title">Border Radius</h3>
                <div className="radius-showcase">
                  <div className="radius-item">
                    <div className="radius-box" style={{ borderRadius: '6px' }}></div>
                    <span className="radius-label">sm (6px)</span>
                  </div>
                  <div className="radius-item">
                    <div className="radius-box" style={{ borderRadius: '8px' }}></div>
                    <span className="radius-label">md (8px)</span>
                  </div>
                  <div className="radius-item">
                    <div className="radius-box" style={{ borderRadius: '12px' }}></div>
                    <span className="radius-label">lg (12px)</span>
                  </div>
                  <div className="radius-item">
                    <div className="radius-box" style={{ borderRadius: '16px' }}></div>
                    <span className="radius-label">xl (16px)</span>
                  </div>
                  <div className="radius-item">
                    <div className="radius-box" style={{ borderRadius: '24px' }}></div>
                    <span className="radius-label">2xl (24px)</span>
                  </div>
                  <div className="radius-item">
                    <div className="radius-box" style={{ borderRadius: '9999px' }}></div>
                    <span className="radius-label">full</span>
                  </div>
                </div>
              </div>

              <div className="design-section">
                <h3 className="section-title">Typography Scale</h3>
                <div className="typography-showcase">
                  <div style={{ fontSize: '48px', fontWeight: 700, margin: '8px 0' }}>Display (48px)</div>
                  <h1 style={{ fontSize: '36px', fontWeight: 700, margin: '8px 0' }}>Heading 1 (36px)</h1>
                  <h2 style={{ fontSize: '30px', fontWeight: 600, margin: '8px 0' }}>Heading 2 (30px)</h2>
                  <h3 style={{ fontSize: '24px', fontWeight: 600, margin: '8px 0' }}>Heading 3 (24px)</h3>
                  <h4 style={{ fontSize: '20px', fontWeight: 600, margin: '8px 0' }}>Heading 4 (20px)</h4>
                  <h5 style={{ fontSize: '18px', fontWeight: 500, margin: '8px 0' }}>Heading 5 (18px)</h5>
                  <p style={{ fontSize: '16px', margin: '8px 0' }}>Body (16px)</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '8px 0' }}>Small (14px)</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '8px 0' }}>Extra Small (12px)</p>
                </div>
              </div>

              <div className="design-section">
                <h3 className="section-title">Shadows & Effects</h3>
                <div className="shadow-showcase">
                  <div className="shadow-item">
                    <div className="shadow-box" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}></div>
                    <span className="shadow-label">Shadow SM</span>
                  </div>
                  <div className="shadow-item">
                    <div className="shadow-box" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)' }}></div>
                    <span className="shadow-label">Shadow MD</span>
                  </div>
                  <div className="shadow-item">
                    <div className="shadow-box" style={{ boxShadow: '0 10px 15px rgba(0, 0, 0, 0.6)' }}></div>
                    <span className="shadow-label">Shadow LG</span>
                  </div>
                  <div className="shadow-item">
                    <div className="shadow-box" style={{ boxShadow: '0 0 30px rgba(141, 123, 251, 0.3)' }}></div>
                    <span className="shadow-label">Glow Effect</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        </div>
      </div>
    </div>
  );
};