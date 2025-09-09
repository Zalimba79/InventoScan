import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DesignComponents } from './DesignComponents';
import MarketplacePanel from './MarketplacePanel';
import { getCardContent, getCardIcon } from './DashboardCards';
import { UploadCenter } from './UploadCenter';
import { ProductDrafts } from './ProductDrafts';
import { Administration } from './Administration';
import { LayoutDemo } from './LayoutDemo';
import { BasePage } from './layout/BasePage';
import { PageBuilder } from './PageBuilder';
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

const ShoppingBagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
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

const LayersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const DraftsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);


const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AdminIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const Dashboard: React.FC = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeNav, setActiveNav] = useState('questionnaire');
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [gridWidth, setGridWidth] = useState(1200);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Grid Layout configuration - nutzt jetzt die volle Breite (12 Spalten)
  const [layout, setLayout] = useState([
    { i: 'value-overview', x: 0, y: 0, w: 4, h: 3, minW: 2, minH: 2 },
    { i: 'daily-capture', x: 4, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'recent-scans', x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'categories', x: 0, y: 3, w: 4, h: 4, minW: 2, minH: 3 },
    { i: 'activity', x: 4, y: 3, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'tasks', x: 4, y: 6, w: 8, h: 3, minW: 3, minH: 2 },
  ]);

  const cardData = {
    'value-overview': { title: 'Wert-Übersicht', visible: true },
    'daily-capture': { title: 'Heutige Erfassung', visible: true },
    'recent-scans': { title: 'Letzte Scans', visible: true },
    'categories': { title: 'Kategorien-Übersicht', visible: true },
    'activity': { title: 'Scan-Aktivität', visible: true },
    'tasks': { title: 'Aufgaben & Erinnerungen', visible: true },
  };

  const [hiddenCards, setHiddenCards] = useState<string[]>([]);

  // Update grid width on resize
  const updateGridWidth = useCallback(() => {
    if (gridContainerRef.current) {
      const containerWidth = gridContainerRef.current.offsetWidth;
      setGridWidth(containerWidth); // Nutze volle Breite
    }
  }, []);

  // Load saved configuration and setup resize observer
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboardGridLayout');
    const savedHidden = localStorage.getItem('dashboardHiddenCards');
    
    if (savedLayout) {
      try {
        setLayout(JSON.parse(savedLayout));
      } catch (e) {
        console.error('Error loading layout:', e);
      }
    }
    
    if (savedHidden) {
      try {
        setHiddenCards(JSON.parse(savedHidden));
      } catch (e) {
        console.error('Error loading hidden cards:', e);
      }
    }

    // Initial width calculation
    updateGridWidth();

    // Setup ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      updateGridWidth();
    });

    if (gridContainerRef.current) {
      resizeObserver.observe(gridContainerRef.current);
    }

    // Window resize fallback
    window.addEventListener('resize', updateGridWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateGridWidth);
    };
  }, [updateGridWidth]);

  // Save configuration
  const saveConfig = () => {
    localStorage.setItem('dashboardGridLayout', JSON.stringify(layout));
    localStorage.setItem('dashboardHiddenCards', JSON.stringify(hiddenCards));
  };

  // Handle layout change - simplified without GridLayout
  // const handleLayoutChange = (newLayout: any) => {
  //   setLayout(newLayout);
  //   if (!editMode) {
  //     localStorage.setItem('dashboardGridLayout', JSON.stringify(newLayout));
  //   }
  // };


  const toggleEditMode = () => {
    const newEditMode = !editMode;
    setEditMode(newEditMode);
    if (!newEditMode) {
      saveConfig();
    }
  };


  
  const toggleCardVisibility = (cardId: string) => {
    if (hiddenCards.includes(cardId)) {
      // Show card
      setHiddenCards(hiddenCards.filter(id => id !== cardId));
      // Add it back to layout
      const newLayoutItem = {
        i: cardId,
        x: 0,
        y: 0,
        w: 4,
        h: 3,
        minW: 2,
        minH: 2
      };
      setLayout([...layout, newLayoutItem]);
    } else {
      // Hide card
      setHiddenCards([...hiddenCards, cardId]);
      setLayout(layout.filter(item => item.i !== cardId));
    }
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Render card content based on card ID

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'upload', label: 'Upload', icon: <CameraIcon /> },
    { id: 'drafts', label: 'Products', icon: <DraftsIcon /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBagIcon /> },
    { id: 'reports', label: 'Reports', icon: <ChartIcon /> },
    { id: 'divider1', isDivider: true },
    { id: 'design', label: 'Design & UI', icon: <PaletteIcon /> },
    { id: 'builder', label: 'Page Builder', icon: <LayersIcon />, badge: '🔨' },
    { id: 'divider2', isDivider: true },
    { id: 'admin', label: 'Administration', icon: <AdminIcon /> },
  ];

  const handleNavClick = (id: string) => {
    // Ignore dividers
    if (id.startsWith('divider')) return;
    
    setActiveNav(id);
    
    // Map navigation items to views
    const viewMap: Record<string, string> = {
      'home': 'dashboard',
      'upload': 'upload',
      'drafts': 'drafts',
      'marketplace': 'marketplace',
      'reports': 'dashboard', // Reports uses dashboard view for now
      'design': 'design',
      'builder': 'builder',
      'admin': 'admin'
    };
    
    setCurrentView(viewMap[id] || 'dashboard');
  };

  // Tab configurations for different sections (kept for future use)
  const getTabsForSection = (section: string) => {
    switch (section) {
      case 'marketplace':
        return [
          { id: 'overview', label: 'Overview' },
          { id: 'ebay', label: 'eBay' },
          { id: 'amazon', label: 'Amazon' },
        ];
      case 'reports':
        return [
          { id: 'overview', label: 'Overview' },
          { id: 'sales', label: 'Sales' },
          { id: 'inventory', label: 'Inventory' },
          { id: 'analytics', label: 'Analytics' },
        ];
      case 'questionnaire':
        return [
          { id: 'overview', label: 'Overview' },
          { id: 'pending', label: 'Pending' },
          { id: 'completed', label: 'Completed' },
        ];
      case 'documents':
        return [
          { id: 'overview', label: 'All Documents' },
          { id: 'invoices', label: 'Invoices' },
          { id: 'receipts', label: 'Receipts' },
          { id: 'reports', label: 'Reports' },
        ];
      default:
        return [
          { id: 'overview', label: 'Overview' },
        ];
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
          {navItems.map(item => {
            if (item.isDivider) {
              return <div key={item.id} className="nav-divider" />;
            }
            return (
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
            );
          })}
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
          ) : currentView === 'dashboard' && activeNav === 'home' ? (
            <>
              {/* Dashboard Controls */}
              <div className="dashboard-controls">
                <div className="controls-left">
                  <h2 className="dashboard-main-title">Dashboard</h2>
                </div>
                <div className="controls-right">
                  <button 
                    className={`edit-mode-btn ${editMode ? 'active' : ''}`}
                    onClick={toggleEditMode}
                  >
                    <EditIcon />
                    <span>{editMode ? 'Fertig' : 'Bearbeiten'}</span>
                  </button>
                </div>
              </div>

              {/* Edit Mode Toolbar */}
              {editMode && (
                <div className="edit-toolbar">
                  <div className="toolbar-info">
                    <span>Karten ziehen zum Neuanordnen • Ecken ziehen für Resize • X zum Verstecken</span>
                  </div>
                  <div className="hidden-cards">
                    {hiddenCards.map(cardId => (
                      <button
                        key={cardId}
                        className="hidden-card-btn"
                        onClick={() => toggleCardVisibility(cardId)}
                      >
                        <span>{cardData[cardId as keyof typeof cardData].title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dashboard Grid */}
              <div ref={gridContainerRef} className="dashboard-grid-container">
                <div className="dashboard-grid">
                  {layout
                    .filter(item => !hiddenCards.includes(item.i))
                    .map((item) => (
                      <div key={item.i} className="status-card">
                        <div className="card-header">
                          <h3 className="card-title">{cardData[item.i as keyof typeof cardData].title}</h3>
                          <span className="card-icon">
                            {getCardIcon(item.i)}
                          </span>
                        </div>
                        
                        <div className="card-content">
                          {getCardContent(item.i, item.w, item.h)}
                        </div>

                        {editMode && (
                          <button 
                            className="card-remove-btn"
                            onClick={() => toggleCardVisibility(item.i)}
                          >
                            <CloseIcon />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : currentView === 'design' ? (
            <DesignComponents />
          ) : currentView === 'upload' ? (
            <UploadCenter />
          ) : currentView === 'drafts' ? (
            <ProductDrafts 
              onNavigateToUpload={() => {
                setCurrentView('upload');
                setActiveNav('upload');
              }}
            />
          ) : currentView === 'layout-demo' ? (
            <LayoutDemo />
          ) : currentView === 'empty' ? (
            <BasePage />
          ) : currentView === 'builder' ? (
            <PageBuilder />
          ) : currentView === 'admin' ? (
            <Administration onEditModeToggle={() => setEditMode(!editMode)} />
          ) : currentView === 'marketplace' ? (
            <div className="content-section">
              {activeTab === 'overview' && (
                <div className="section-overview">
                  <p>Select eBay or Amazon tabs to manage your marketplace listings and integrations.</p>
                </div>
              )}
              {activeTab === 'ebay' && <MarketplacePanel />}
              {activeTab === 'amazon' && <MarketplacePanel />}
            </div>
          ) : activeNav === 'questionnaire' ? (
            <div className="content-section">
              {activeTab === 'overview' && (
                <div className="section-overview">
                  <p>Track your Carbon Disclosure Project submissions and sustainability reporting.</p>
                </div>
              )}
              {activeTab === 'pending' && (
                <div className="section-content">
                  <p>You have 2 questionnaires that require your attention.</p>
                </div>
              )}
              {activeTab === 'completed' && (
                <div className="section-content">
                  <p>View your submission history and completed assessments.</p>
                </div>
              )}
            </div>
          ) : activeNav === 'reports' ? (
            <div className="content-section">
              {activeTab === 'overview' && (
                <div className="section-overview">
                  <p>Access all your business reports, analytics, and performance metrics.</p>
                </div>
              )}
              {activeTab === 'sales' && (
                <div className="section-content">
                  <p>Track sales performance, revenue trends, and customer insights.</p>
                </div>
              )}
              {activeTab === 'inventory' && (
                <div className="section-content">
                  <p>Monitor stock levels, turnover rates, and inventory movements.</p>
                </div>
              )}
              {activeTab === 'analytics' && (
                <div className="section-content">
                  <p>Deep dive into business metrics with advanced analytics dashboards.</p>
                </div>
              )}
            </div>
          ) : activeNav === 'documents' ? (
            <div className="content-section">
              {activeTab === 'overview' && (
                <div className="section-overview">
                  <p>Browse and manage all your business documents in one place.</p>
                </div>
              )}
              {activeTab === 'invoices' && (
                <div className="section-content">
                  <p>View, download, and manage your invoice documents.</p>
                </div>
              )}
              {activeTab === 'receipts' && (
                <div className="section-content">
                  <p>Organize and access your purchase receipts.</p>
                </div>
              )}
              {activeTab === 'reports' && (
                <div className="section-content">
                  <p>Access your archived reports and historical data.</p>
                </div>
              )}
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