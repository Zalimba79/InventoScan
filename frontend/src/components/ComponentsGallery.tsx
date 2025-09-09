import React, { useState } from 'react'
import './ComponentsGallery.css'
import { 
  GridIcon, 
  LayersIcon, 
  ChartIcon, 
  ButtonIcon, 
  BadgeIcon, 
  PaletteIcon, 
  TypeIcon 
} from './icons'

export const ComponentsGallery: React.FC = () => {
  const [activeSection, setActiveSection] = useState('cards')

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1 className="gallery-title">Dashboard Components Gallery</h1>
        <p className="gallery-subtitle">Alle UI-Komponenten für Dashboard-Gestaltung</p>
      </div>

      <div className="gallery-tabs">
        <button 
          className={`tab-button ${activeSection === 'cards' ? 'active' : ''}`}
          onClick={() => setActiveSection('cards')}
        >
          <GridIcon />
          <span>Cards</span>
        </button>
        <button 
          className={`tab-button ${activeSection === 'layouts' ? 'active' : ''}`}
          onClick={() => setActiveSection('layouts')}
        >
          <LayersIcon />
          <span>Layouts</span>
        </button>
        <button 
          className={`tab-button ${activeSection === 'visualizations' ? 'active' : ''}`}
          onClick={() => setActiveSection('visualizations')}
        >
          <ChartIcon />
          <span>Visualizations</span>
        </button>
        <button 
          className={`tab-button ${activeSection === 'buttons' ? 'active' : ''}`}
          onClick={() => setActiveSection('buttons')}
        >
          <ButtonIcon />
          <span>Buttons</span>
        </button>
        <button 
          className={`tab-button ${activeSection === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveSection('badges')}
        >
          <BadgeIcon />
          <span>Badges</span>
        </button>
        <button 
          className={`tab-button ${activeSection === 'colors' ? 'active' : ''}`}
          onClick={() => setActiveSection('colors')}
        >
          <PaletteIcon />
          <span>Colors</span>
        </button>
        <button 
          className={`tab-button ${activeSection === 'typography' ? 'active' : ''}`}
          onClick={() => setActiveSection('typography')}
        >
          <TypeIcon />
          <span>Typography</span>
        </button>
      </div>

      <div className="gallery-content">
        {activeSection === 'cards' && (
          <div className="section-content">
            <h2>Card Sizes & Styles</h2>
            
            <div className="size-grid">
              <div className="size-demo">
                <div className="demo-card card-xs">
                  <span className="size-label">XS</span>
                  <span className="size-dims">80px × 160px</span>
                </div>
                <p>Kompakte Metriken</p>
              </div>

              <div className="size-demo">
                <div className="demo-card card-sm">
                  <span className="size-label">SM</span>
                  <span className="size-dims">120px × 240px</span>
                </div>
                <p>Mini Cards</p>
              </div>

              <div className="size-demo">
                <div className="demo-card card-md">
                  <span className="size-label">MD</span>
                  <span className="size-dims">180px × 320px</span>
                </div>
                <p>Standard Cards</p>
              </div>

              <div className="size-demo">
                <div className="demo-card card-lg">
                  <span className="size-label">LG</span>
                  <span className="size-dims">240px × 400px</span>
                </div>
                <p>Feature Cards</p>
              </div>
            </div>

            <h3>Card Varianten</h3>
            <div className="variants-grid">
              <div className="variant-card glass-card">
                <h4>Glass Card</h4>
                <p>Mit Glassmorphismus-Effekt</p>
              </div>

              <div className="variant-card gradient-card">
                <h4>Gradient Card</h4>
                <p>Mit Farbverlauf</p>
              </div>

              <div className="variant-card bordered-card">
                <h4>Bordered Card</h4>
                <p>Mit Purple Glow Border</p>
              </div>

              <div className="variant-card elevated-card">
                <h4>Elevated Card</h4>
                <p>Mit Schatten-Effekt</p>
              </div>
            </div>

            <h3>Card Components</h3>
            <div className="components-list">
              <div className="component-item">
                <div className="component-preview metric-card-preview">
                  <div className="metric-ring-demo">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="circle" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <text x="18" y="20.35" className="percentage">75%</text>
                    </svg>
                  </div>
                  <span>Metric Card mit Progress Ring</span>
                </div>
              </div>

              <div className="component-item">
                <div className="component-preview stats-card-preview">
                  <div className="stats-demo">
                    <span className="stat-value">€ 24.850</span>
                    <span className="stat-label">Gesamtwert</span>
                  </div>
                  <span>Stats Card mit Werten</span>
                </div>
              </div>

              <div className="component-item">
                <div className="component-preview list-card-preview">
                  <div className="list-demo">
                    <div className="list-item-demo">
                      <span className="item-icon">📦</span>
                      <span className="item-text">Item 1</span>
                    </div>
                    <div className="list-item-demo">
                      <span className="item-icon">📱</span>
                      <span className="item-text">Item 2</span>
                    </div>
                  </div>
                  <span>List Card mit Items</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'layouts' && (
          <div className="section-content">
            <h2>Layout Patterns</h2>
            
            <div className="layouts-grid">
              <div className="layout-demo">
                <h4>2-Column Grid</h4>
                <div className="layout-preview grid-2">
                  <div className="layout-box"></div>
                  <div className="layout-box"></div>
                </div>
              </div>

              <div className="layout-demo">
                <h4>3-Column Grid</h4>
                <div className="layout-preview grid-3">
                  <div className="layout-box"></div>
                  <div className="layout-box"></div>
                  <div className="layout-box"></div>
                </div>
              </div>

              <div className="layout-demo">
                <h4>Sidebar Layout</h4>
                <div className="layout-preview sidebar-layout">
                  <div className="layout-sidebar"></div>
                  <div className="layout-main"></div>
                </div>
              </div>

              <div className="layout-demo">
                <h4>Masonry Grid</h4>
                <div className="layout-preview masonry">
                  <div className="layout-box tall"></div>
                  <div className="layout-box"></div>
                  <div className="layout-box"></div>
                  <div className="layout-box tall"></div>
                </div>
              </div>
            </div>

            <h3>Spacing System (8px Grid)</h3>
            <div className="spacing-demo">
              {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map(space => (
                <div key={space} className="spacing-item">
                  <div className="spacing-box" style={{ width: `${space * 8}px`, height: '32px' }}></div>
                  <span>space-{space} ({space * 8}px)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'visualizations' && (
          <div className="section-content">
            <h2>Data Visualizations</h2>
            
            <div className="viz-grid">
              <div className="viz-demo">
                <h4>Line Chart</h4>
                <svg viewBox="0 0 200 100" className="line-chart-demo">
                  <polyline
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    points="0,80 40,65 80,70 120,40 160,45 200,20"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#8D7BFB', stopOpacity: 0.8 }} />
                      <stop offset="100%" style={{ stopColor: '#A593FF', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="viz-demo">
                <h4>Bar Chart</h4>
                <div className="bar-chart-demo">
                  <div className="bar" style={{ height: '60%' }}></div>
                  <div className="bar" style={{ height: '80%' }}></div>
                  <div className="bar" style={{ height: '45%' }}></div>
                  <div className="bar" style={{ height: '90%' }}></div>
                  <div className="bar" style={{ height: '70%' }}></div>
                </div>
              </div>

              <div className="viz-demo">
                <h4>Progress Rings</h4>
                <div className="rings-demo">
                  <svg viewBox="0 0 36 36" className="ring-demo purple">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray="65, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <svg viewBox="0 0 36 36" className="ring-demo green">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <svg viewBox="0 0 36 36" className="ring-demo blue">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray="45, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                </div>
              </div>

              <div className="viz-demo">
                <h4>Activity Heatmap</h4>
                <div className="heatmap-demo">
                  {Array.from({ length: 35 }, (_, i) => (
                    <div 
                      key={i} 
                      className="heatmap-cell" 
                      style={{ 
                        opacity: Math.random(),
                        background: 'var(--purple-500)'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'buttons' && (
          <div className="section-content">
            <h2>Button Styles</h2>
            
            <div className="buttons-showcase">
              <div className="button-group">
                <h4>Primary Buttons</h4>
                <button className="btn-demo btn-primary-gradient">Gradient Button</button>
                <button className="btn-demo btn-primary-solid">Solid Button</button>
                <button className="btn-demo btn-primary-outline">Outline Button</button>
                <button className="btn-demo btn-primary-ghost">Ghost Button</button>
              </div>

              <div className="button-group">
                <h4>Button Sizes</h4>
                <button className="btn-demo btn-xs">XS Button</button>
                <button className="btn-demo btn-sm">SM Button</button>
                <button className="btn-demo btn-md">MD Button</button>
                <button className="btn-demo btn-lg">LG Button</button>
                <button className="btn-demo btn-xl">XL Button</button>
              </div>

              <div className="button-group">
                <h4>Icon Buttons</h4>
                <button className="btn-demo btn-icon">
                  <ChartIcon />
                </button>
                <button className="btn-demo btn-icon-text">
                  <GridIcon />
                  <span>Mit Text</span>
                </button>
                <button className="btn-demo btn-fab">
                  +
                </button>
              </div>

              <div className="button-group">
                <h4>State Buttons</h4>
                <button className="btn-demo btn-loading">
                  <span className="spinner"></span>
                  Loading...
                </button>
                <button className="btn-demo btn-success">Success</button>
                <button className="btn-demo btn-warning">Warning</button>
                <button className="btn-demo btn-error">Error</button>
                <button className="btn-demo" disabled>Disabled</button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'badges' && (
          <div className="section-content">
            <h2>Badges & Indicators</h2>
            
            <div className="badges-showcase">
              <div className="badge-group">
                <h4>Status Badges</h4>
                <div className="badge-row">
                  <span className="badge badge-default">Default</span>
                  <span className="badge badge-primary">Primary</span>
                  <span className="badge badge-success">Success</span>
                  <span className="badge badge-warning">Warning</span>
                  <span className="badge badge-error">Error</span>
                  <span className="badge badge-info">Info</span>
                </div>
              </div>

              <div className="badge-group">
                <h4>Notification Badges</h4>
                <div className="badge-row">
                  <div className="badge-icon-wrapper">
                    <ChartIcon />
                    <span className="badge-dot"></span>
                  </div>
                  <div className="badge-icon-wrapper">
                    <GridIcon />
                    <span className="badge-count">3</span>
                  </div>
                  <div className="badge-icon-wrapper">
                    <LayersIcon />
                    <span className="badge-count">99+</span>
                  </div>
                </div>
              </div>

              <div className="badge-group">
                <h4>Tags</h4>
                <div className="badge-row">
                  <span className="tag tag-purple">Elektronik</span>
                  <span className="tag tag-blue">Möbel</span>
                  <span className="tag tag-green">Bücher</span>
                  <span className="tag tag-orange">Sonstiges</span>
                  <span className="tag tag-removable">
                    Removable
                    <button className="tag-remove">×</button>
                  </span>
                </div>
              </div>

              <div className="badge-group">
                <h4>Progress Indicators</h4>
                <div className="progress-indicators">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <div className="progress-steps">
                    <div className="step completed"></div>
                    <div className="step completed"></div>
                    <div className="step active"></div>
                    <div className="step"></div>
                  </div>
                  <div className="skeleton-loader"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'colors' && (
          <div className="section-content">
            <h2>Color System</h2>
            
            <div className="colors-showcase">
              <div className="color-group">
                <h4>Purple Palette</h4>
                <div className="color-swatches">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                    <div key={shade} className="color-swatch">
                      <div className={`swatch purple-${shade}`}></div>
                      <span>Purple {shade}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="color-group">
                <h4>Gradients</h4>
                <div className="gradient-samples">
                  <div className="gradient-sample gradient-primary">Primary Gradient</div>
                  <div className="gradient-sample gradient-subtle">Subtle Gradient</div>
                  <div className="gradient-sample gradient-mesh">Mesh Gradient</div>
                  <div className="gradient-sample gradient-glow">Glow Gradient</div>
                </div>
              </div>

              <div className="color-group">
                <h4>Glassmorphism</h4>
                <div className="glass-samples">
                  <div className="glass-sample glass-light">Light Glass</div>
                  <div className="glass-sample glass-medium">Medium Glass</div>
                  <div className="glass-sample glass-strong">Strong Glass</div>
                </div>
              </div>

              <div className="color-group">
                <h4>Shadows</h4>
                <div className="shadow-samples">
                  <div className="shadow-sample shadow-sm">Small Shadow</div>
                  <div className="shadow-sample shadow-md">Medium Shadow</div>
                  <div className="shadow-sample shadow-lg">Large Shadow</div>
                  <div className="shadow-sample shadow-purple">Purple Glow</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'typography' && (
          <div className="section-content">
            <h2>Typography System</h2>
            
            <div className="typography-showcase">
              <div className="type-group">
                <h3>Schriftgrößen</h3>
                <div className="type-samples">
                  <div className="type-sample">
                    <span style={{ fontSize: 'var(--text-5xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                      Display Large
                    </span>
                    <span className="type-meta">48px / 3rem • Bold • Primary</span>
                  </div>
                  <div className="type-sample">
                    <span style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                      Heading 1
                    </span>
                    <span className="type-meta">36px / 2.25rem • Semibold • Primary</span>
                  </div>
                  <div className="type-sample">
                    <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                      Heading 2
                    </span>
                    <span className="type-meta">30px / 1.875rem • Semibold • Primary</span>
                  </div>
                  <div className="type-sample">
                    <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
                      Heading 3
                    </span>
                    <span className="type-meta">24px / 1.5rem • Medium • Primary</span>
                  </div>
                  <div className="type-sample">
                    <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
                      Heading 4
                    </span>
                    <span className="type-meta">20px / 1.25rem • Medium • Primary</span>
                  </div>
                  <div className="type-sample">
                    <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-normal)', color: 'var(--text-primary)' }}>
                      Body Large
                    </span>
                    <span className="type-meta">18px / 1.125rem • Regular • Primary</span>
                  </div>
                  <div className="type-sample">
                    <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-normal)', color: 'var(--text-primary)' }}>
                      Body Regular
                    </span>
                    <span className="type-meta">16px / 1rem • Regular • Primary</span>
                  </div>
                  <div className="type-sample">
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-normal)', color: 'var(--text-secondary)' }}>
                      Body Small
                    </span>
                    <span className="type-meta">14px / 0.875rem • Regular • Secondary</span>
                  </div>
                  <div className="type-sample">
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-normal)', color: 'var(--text-tertiary)' }}>
                      Caption
                    </span>
                    <span className="type-meta">12px / 0.75rem • Regular • Tertiary</span>
                  </div>
                </div>
              </div>

              <div className="type-group">
                <h3>Textfarben & Lesbarkeit</h3>
                <div className="color-contrast-grid">
                  <div className="contrast-card">
                    <div className="contrast-sample" style={{ background: 'var(--bg-dark-primary)' }}>
                      <p style={{ color: 'var(--text-primary)' }}>Primary Text</p>
                      <p style={{ color: 'var(--text-secondary)' }}>Secondary Text</p>
                      <p style={{ color: 'var(--text-tertiary)' }}>Tertiary Text</p>
                      <p style={{ color: 'var(--text-muted)' }}>Muted Text</p>
                    </div>
                    <span className="contrast-label">Dark Background</span>
                    <div className="contrast-info">
                      <span className="wcag-badge wcag-aaa">WCAG AAA</span>
                      <span className="contrast-ratio">15.3:1</span>
                    </div>
                  </div>

                  <div className="contrast-card">
                    <div className="contrast-sample" style={{ background: 'var(--bg-card)' }}>
                      <p style={{ color: 'var(--text-primary)' }}>Primary Text</p>
                      <p style={{ color: 'var(--text-secondary)' }}>Secondary Text</p>
                      <p style={{ color: 'var(--text-tertiary)' }}>Tertiary Text</p>
                      <p style={{ color: 'var(--text-muted)' }}>Muted Text</p>
                    </div>
                    <span className="contrast-label">Card Background</span>
                    <div className="contrast-info">
                      <span className="wcag-badge wcag-aa">WCAG AA</span>
                      <span className="contrast-ratio">12.1:1</span>
                    </div>
                  </div>

                  <div className="contrast-card">
                    <div className="contrast-sample gradient-bg" style={{ background: 'var(--gradient-purple)' }}>
                      <p style={{ color: 'var(--text-primary)' }}>Primary Text</p>
                      <p style={{ color: '#FFFFFF' }}>Pure White</p>
                      <p style={{ color: 'rgba(255,255,255,0.9)' }}>90% White</p>
                      <p style={{ color: 'rgba(255,255,255,0.8)' }}>80% White</p>
                    </div>
                    <span className="contrast-label">Gradient Background</span>
                    <div className="contrast-info">
                      <span className="wcag-badge wcag-aa">WCAG AA</span>
                      <span className="contrast-ratio">4.5:1</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="type-group">
                <h3>Schriftgewichte</h3>
                <div className="weight-samples">
                  <div className="weight-sample">
                    <span style={{ fontWeight: 'var(--font-normal)' }}>Regular (400)</span>
                    <p style={{ fontWeight: 'var(--font-normal)', color: 'var(--text-secondary)' }}>
                      Der schnelle braune Fuchs springt über den faulen Hund. 
                      Für Fließtext und längere Inhalte optimiert.
                    </p>
                  </div>
                  <div className="weight-sample">
                    <span style={{ fontWeight: 'var(--font-medium)' }}>Medium (500)</span>
                    <p style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>
                      Der schnelle braune Fuchs springt über den faulen Hund.
                      Für Subheadlines und Labels.
                    </p>
                  </div>
                  <div className="weight-sample">
                    <span style={{ fontWeight: 'var(--font-semibold)' }}>Semibold (600)</span>
                    <p style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)' }}>
                      Der schnelle braune Fuchs springt über den faulen Hund.
                      Für Headlines und wichtige UI-Elemente.
                    </p>
                  </div>
                  <div className="weight-sample">
                    <span style={{ fontWeight: 'var(--font-bold)' }}>Bold (700)</span>
                    <p style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-secondary)' }}>
                      Der schnelle braune Fuchs springt über den faulen Hund.
                      Für starke Betonung und Display-Text.
                    </p>
                  </div>
                </div>
              </div>

              <div className="type-group">
                <h3>Zeilenhöhen</h3>
                <div className="leading-samples">
                  <div className="leading-sample">
                    <span className="leading-label">Tight (1.25)</span>
                    <p style={{ lineHeight: 'var(--leading-tight)', fontSize: 'var(--text-base)' }}>
                      Diese Zeilenhöhe eignet sich für große Headlines und Display-Text.
                      Sie sollte nicht für längere Textpassagen verwendet werden, da die
                      Lesbarkeit darunter leidet.
                    </p>
                  </div>
                  <div className="leading-sample">
                    <span className="leading-label">Normal (1.5)</span>
                    <p style={{ lineHeight: 'var(--leading-normal)', fontSize: 'var(--text-base)' }}>
                      Die normale Zeilenhöhe ist optimal für die meisten Anwendungsfälle.
                      Sie bietet ein ausgewogenes Verhältnis zwischen Kompaktheit und
                      Lesbarkeit für Fließtext und UI-Komponenten.
                    </p>
                  </div>
                  <div className="leading-sample">
                    <span className="leading-label">Relaxed (1.75)</span>
                    <p style={{ lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-base)' }}>
                      Eine entspannte Zeilenhöhe verbessert die Lesbarkeit bei längeren Texten.
                      Sie wird für Dokumentation, Artikel und andere textlastige Inhalte
                      empfohlen, wo maximale Lesbarkeit Priorität hat.
                    </p>
                  </div>
                </div>
              </div>

              <div className="type-group">
                <h3>Praktische Beispiele</h3>
                <div className="type-examples">
                  <div className="example-card">
                    <h4 style={{ color: 'var(--primary-purple)', marginBottom: 'var(--space-2)' }}>Card Title</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                      Subtitle mit zusätzlichen Informationen
                    </p>
                    <p style={{ color: 'var(--text-primary)', lineHeight: 'var(--leading-normal)' }}>
                      Hauptinhalt der Karte mit normalem Text in optimaler Lesbarkeit.
                    </p>
                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', display: 'block' }}>
                      Vor 2 Stunden • 5 Min. Lesezeit
                    </span>
                  </div>

                  <div className="example-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                      <span className="status-badge" style={{ background: 'var(--gradient-purple)', color: 'white', padding: '4px 8px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)' }}>
                        NEU
                      </span>
                      <h4 style={{ margin: 0 }}>Feature Announcement</h4>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Entdecken Sie die neuen Funktionen in Version 2.0
                    </p>
                    <button style={{ 
                      marginTop: 'var(--space-3)',
                      background: 'var(--primary-purple)',
                      color: 'white',
                      border: 'none',
                      padding: 'var(--space-2) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 'var(--font-medium)',
                      cursor: 'pointer'
                    }}>
                      Mehr erfahren →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}