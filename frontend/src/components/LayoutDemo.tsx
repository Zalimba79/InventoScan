import React, { useState } from 'react';
import { PageLayout, PageHeader, PageToolbar, PageContent } from './layout';
import './LayoutDemo.css';

// Demo Icons
const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

export const LayoutDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('example1');

  const tabs = [
    { id: 'example1', label: 'Mit Action Button' },
    { id: 'example2', label: 'Mit Tabs' },
    { id: 'example3', label: 'Mit Filter Toolbar' },
    { id: 'example4', label: 'Minimal' },
  ];

  const renderExample = () => {
    switch (activeTab) {
      case 'example1':
        return (
          <PageLayout>
            <PageHeader 
              title="Beispielseite mit Action"
              description="Diese Seite zeigt den Header mit Beschreibung und Action Button"
              action={
                <button className="demo-action-btn">
                  <CameraIcon />
                  <span>Neue Aktion</span>
                </button>
              }
            />
            <PageContent>
              <div className="demo-content">
                <h2>Content Bereich</h2>
                <p>Hier kommt der Hauptinhalt der Seite.</p>
                <div className="demo-cards">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="demo-card">
                      <h3>Karte {i}</h3>
                      <p>Beispielinhalt für Karte {i}</p>
                    </div>
                  ))}
                </div>
              </div>
            </PageContent>
          </PageLayout>
        );

      case 'example2':
        return (
          <PageLayout>
            <PageHeader title="Seite mit Tab-Navigation" />
            <PageToolbar variant="tabs">
              <button className="tab-item active">Tab 1</button>
              <button className="tab-item">Tab 2</button>
              <button className="tab-item">Tab 3</button>
              <button className="tab-item">Tab 4</button>
            </PageToolbar>
            <PageContent>
              <div className="demo-content">
                <h2>Tab Content</h2>
                <p>Inhalt für den aktiven Tab.</p>
              </div>
            </PageContent>
          </PageLayout>
        );

      case 'example3':
        return (
          <PageLayout>
            <PageHeader 
              title="Seite mit Filter"
              action={
                <button className="demo-action-btn">
                  <FilterIcon />
                  <span>Filter</span>
                </button>
              }
            />
            <PageToolbar variant="filters">
              <div className="demo-filters">
                <input type="text" placeholder="Suchen..." className="demo-search" />
                <select className="demo-select">
                  <option>Alle Kategorien</option>
                  <option>Kategorie 1</option>
                  <option>Kategorie 2</option>
                </select>
              </div>
              <div className="demo-actions">
                <button className="demo-filter-btn">Anwenden</button>
                <button className="demo-filter-btn secondary">Zurücksetzen</button>
              </div>
            </PageToolbar>
            <PageContent>
              <div className="demo-content">
                <h2>Gefilterte Ergebnisse</h2>
                <p>Hier werden die gefilterten Inhalte angezeigt.</p>
              </div>
            </PageContent>
          </PageLayout>
        );

      case 'example4':
        return (
          <PageLayout>
            <PageHeader title="Minimale Seite" />
            <PageContent>
              <div className="demo-content">
                <h2>Einfacher Content</h2>
                <p>Eine minimale Seite ohne Toolbar oder Actions.</p>
                <p>Perfekt für einfache Inhaltsseiten.</p>
              </div>
            </PageContent>
          </PageLayout>
        );

      default:
        return null;
    }
  };

  return (
    <div className="layout-demo">
      <div className="demo-header">
        <h1>Layout-Komponenten Demo</h1>
        <p>Beispiele für konsistente Seitenstrukturen</p>
      </div>
      
      <div className="demo-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`demo-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="demo-preview">
        {renderExample()}
      </div>
    </div>
  );
};

export default LayoutDemo;