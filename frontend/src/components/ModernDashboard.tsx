import React, { useState } from 'react';
import './ModernDashboard.css';
import { Card, CardHeader, CardBody, Button, Badge, Progress, Input } from './ui';

// Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

interface Question {
  id: string;
  title: string;
  status: 'complete' | 'in-progress' | 'pending';
  progress?: number;
  category?: string;
  subQuestions?: number;
  editManually?: boolean;
}

export const ModernDashboard: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>('2');
  const [searchQuery, setSearchQuery] = useState('');

  const questions: Question[] = [
    { 
      id: '1', 
      title: 'What is your main customer engagement goal?', 
      status: 'complete',
      progress: 100,
      category: 'Climate change'
    },
    { 
      id: '2', 
      title: 'What was your company\'s carbon emissions during the last year?', 
      status: 'in-progress',
      progress: 75,
      category: 'Climate change',
      subQuestions: 2,
      editManually: true
    },
    { 
      id: '3', 
      title: 'How effective is your marketing automation?', 
      status: 'pending',
      category: 'Climate change'
    }
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">InventoScan</h1>
          <Badge variant="primary" size="sm">Pro</Badge>
        </div>
        <div className="header-center">
          <div className="search-container">
            <SearchIcon />
            <input 
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>
        <div className="header-right">
          <Button variant="ghost" size="sm" icon={<UploadIcon />}>
            Upload & Manage
          </Button>
          <Button variant="primary" size="sm">
            Go to Subquestionaires
          </Button>
          <div className="user-avatar">
            <img src="https://ui-avatars.com/api/?name=User&background=8D7BFB&color=fff" alt="User" />
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <div className="nav-section">
              <button className="nav-item">
                <span className="nav-icon">🏠</span>
                <span>Overview</span>
              </button>
              <button className="nav-item active">
                <span className="nav-icon">📋</span>
                <span>Your CDP Questionnaire</span>
                <Badge variant="info" size="sm">2</Badge>
              </button>
              <button className="nav-item">
                <span className="nav-icon">📊</span>
                <span>Analytics</span>
              </button>
              <button className="nav-item">
                <span className="nav-icon">📦</span>
                <span>Inventory</span>
              </button>
              <button className="nav-item">
                <span className="nav-icon">⚙️</span>
                <span>Settings</span>
              </button>
            </div>
          </nav>

          <div className="sidebar-footer">
            <Button variant="ghost" icon={<StarIcon />} fullWidth>
              Flagged Questions
            </Button>
            <Button variant="primary" icon={<PlusIcon />} fullWidth>
              Filter
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="main-header">
            <h2 className="section-title">Your CDP Questionnaire:</h2>
            <div className="header-actions">
              <Button variant="ghost" size="sm">Upload & Manage files</Button>
              <Button variant="secondary" size="sm">Go to Subquestionaires</Button>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">10/10 complete</span>
              <Progress value={100} max={100} variant="gradient" />
            </div>
          </div>

          {/* Questions List */}
          <div className="questions-container">
            {questions.map((question) => (
              <Card 
                key={question.id}
                className={`question-card ${selectedQuestion === question.id ? 'selected' : ''}`}
                hoverable
                clickable
                onClick={() => setSelectedQuestion(question.id)}
              >
                <div className="question-content">
                  <div className="question-left">
                    <div className="question-header">
                      <span className="question-icon">💬</span>
                      <h3 className="question-title">Question {question.id}</h3>
                      {question.category && (
                        <Badge variant="default" size="sm">{question.category}</Badge>
                      )}
                    </div>
                    <p className="question-text">{question.title}</p>
                    <div className="question-meta">
                      <span className="meta-item">
                        Answer: {question.status === 'complete' ? 'Complete' : 
                                question.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </span>
                      {question.subQuestions && (
                        <span className="meta-item">
                          {question.subQuestions} Subquestions
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="question-right">
                    {question.status === 'complete' && (
                      <Badge variant="success">✓</Badge>
                    )}
                    {question.status === 'in-progress' && question.progress && (
                      <div className="question-progress">
                        <span className="progress-text">{question.progress}%</span>
                        <Progress value={question.progress} max={100} size="sm" />
                      </div>
                    )}
                    <button className="question-action">
                      <ChevronIcon />
                    </button>
                  </div>
                </div>
                {selectedQuestion === question.id && (
                  <div className="question-details">
                    <div className="details-actions">
                      <Button variant="secondary" size="sm">View Details</Button>
                      {question.editManually && (
                        <>
                          <span className="separator">|</span>
                          <Button variant="ghost" size="sm">Edit manually</Button>
                        </>
                      )}
                    </div>
                    {question.subQuestions && (
                      <div className="subquestions-list">
                        <div className="subquestion-item">
                          <span>How many tons do we have?</span>
                          <Badge variant="success" size="sm">✓</Badge>
                        </div>
                        <div className="subquestion-item">
                          <span>Do we have a way to measure waste?</span>
                          <Badge variant="success" size="sm">✓</Badge>
                        </div>
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="add-subquestion"
                      icon={<PlusIcon />}
                    >
                      Add to Subquestionnaire
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* AI Breakdown Section */}
          <Card className="ai-section">
            <CardHeader title="🤖 AI breakdown" />
            <CardBody>
              <div className="ai-content">
                <p className="ai-description">
                  Do we recycle? How many tons do we have? Do we have a way to measure waste?
                </p>
                <Badge variant="primary">Edit manually</Badge>
              </div>
            </CardBody>
          </Card>
        </main>

        {/* Right Sidebar */}
        <aside className="dashboard-right">
          <Card className="info-card">
            <CardHeader title="Quick Stats" />
            <CardBody>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total Items</span>
                  <span className="stat-value">1,247</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Categories</span>
                  <span className="stat-value">12</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Low Stock</span>
                  <span className="stat-value">23</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Value</span>
                  <span className="stat-value">€127.4k</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="activity-card">
            <CardHeader title="Recent Activity" />
            <CardBody>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">📦</span>
                  <div className="activity-content">
                    <span className="activity-text">New item added</span>
                    <span className="activity-time">2 min ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📸</span>
                  <div className="activity-content">
                    <span className="activity-text">Image uploaded</span>
                    <span className="activity-time">15 min ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">⚠️</span>
                  <div className="activity-content">
                    <span className="activity-text">Low stock alert</span>
                    <span className="activity-time">1 hour ago</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
};