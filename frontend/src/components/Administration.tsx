import React from 'react';
import { BaseWithTabs, type TabContentData } from './layout';
import { SecurityStatus } from './SecurityStatus';
import './Administration.css';

// Tab Icons
const SecurityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M21 12h-6m-6 0H3m13.22 4.22l4.24 4.24M1.54 21.54l4.24-4.24"></path>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const DatabaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const LogsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

// Dashboard Settings Content
const DashboardSettings: React.FC<{ onEditModeToggle?: () => void }> = ({ onEditModeToggle }) => (
  <div className="dashboard-settings">
    <div className="settings-section">
      <h3>Layout Configuration</h3>
      <div className="setting-item">
        <label>Edit Mode</label>
        <button 
          className="btn-toggle"
          onClick={onEditModeToggle}
        >
          Enable Dashboard Edit Mode
        </button>
        <p className="setting-description">
          Allows you to rearrange and resize dashboard cards
        </p>
      </div>
      
      <div className="setting-item">
        <label>Auto-Save Layout</label>
        <input type="checkbox" defaultChecked />
        <p className="setting-description">
          Automatically save layout changes
        </p>
      </div>
    </div>

    <div className="settings-section">
      <h3>Display Settings</h3>
      <div className="setting-item">
        <label>Theme</label>
        <select defaultValue="dark">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      
      <div className="setting-item">
        <label>Sidebar Default State</label>
        <select defaultValue="collapsed">
          <option value="expanded">Expanded</option>
          <option value="collapsed">Collapsed</option>
        </select>
      </div>
    </div>

    <div className="settings-section">
      <h3>Performance</h3>
      <div className="setting-item">
        <label>Enable Virtualization</label>
        <input type="checkbox" defaultChecked />
        <p className="setting-description">
          Automatically virtualize lists with 50+ items
        </p>
      </div>
      
      <div className="setting-item">
        <label>Animation Speed</label>
        <select defaultValue="normal">
          <option value="fast">Fast</option>
          <option value="normal">Normal</option>
          <option value="slow">Slow</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>
    </div>
  </div>
);

// User Management Content
const UserManagement: React.FC = () => (
  <div className="user-management">
    <div className="coming-soon">
      <p>User management features coming soon...</p>
      <ul>
        <li>User roles and permissions</li>
        <li>Access control</li>
        <li>Activity monitoring</li>
        <li>User invitations</li>
      </ul>
    </div>
  </div>
);

// Database Management Content
const DatabaseManagement: React.FC = () => (
  <div className="database-management">
    <div className="coming-soon">
      <p>Database tools coming soon...</p>
      <ul>
        <li>Backup & Restore</li>
        <li>Data Export/Import</li>
        <li>Database Statistics</li>
        <li>Query Console</li>
      </ul>
    </div>
  </div>
);

// System Logs Content
const SystemLogs: React.FC = () => (
  <div className="system-logs">
    <div className="coming-soon">
      <p>System logging features coming soon...</p>
      <ul>
        <li>Application logs</li>
        <li>Error tracking</li>
        <li>API request logs</li>
        <li>Security audit logs</li>
      </ul>
    </div>
  </div>
);

export const Administration: React.FC<{ onEditModeToggle?: () => void }> = ({ onEditModeToggle }) => {
  const tabData: TabContentData[] = [
    {
      id: 'security',
      label: 'Security Status',
      icon: <SecurityIcon />,
      content: {
        title: 'Security Status',
        description: 'Monitor and manage security settings',
        component: <SecurityStatus />
      }
    },
    {
      id: 'dashboard',
      label: 'Dashboard Settings',
      icon: <SettingsIcon />,
      content: {
        title: 'Dashboard Settings',
        description: 'Configure dashboard layout and display options',
        component: <DashboardSettings onEditModeToggle={onEditModeToggle} />
      }
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <UsersIcon />,
      content: {
        title: 'User Management',
        description: 'Manage user accounts and permissions',
        component: <UserManagement />
      }
    },
    {
      id: 'database',
      label: 'Database',
      icon: <DatabaseIcon />,
      content: {
        title: 'Database Management',
        description: 'Database tools and maintenance',
        component: <DatabaseManagement />
      }
    },
    {
      id: 'logs',
      label: 'System Logs',
      icon: <LogsIcon />,
      content: {
        title: 'System Logs',
        description: 'View and analyze system activity',
        component: <SystemLogs />
      }
    }
  ];

  return (
    <BaseWithTabs
      title="Administration"
      subtitle="System configuration and management"
      tabs={tabData}
      defaultTab="security"
    />
  );
};

export default Administration;