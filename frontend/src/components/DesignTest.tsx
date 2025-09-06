import React, { useState } from 'react'
import './DesignTest.css'
import { 
  Button, 
  Card, 
  CardHeader,
  CardBody,
  CardFooter,
  Input, 
  Textarea,
  Badge,
  BadgeGroup,
  Alert,
  Modal,
  Dialog,
  Loader,
  Spinner,
  Progress,
  Skeleton,
  EmptyState
} from './ui'

export const DesignTest: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertVisible, setAlertVisible] = useState(true)

  return (
    <div className="design-test">
      <div className="design-test-header">
        <h1 className="design-test-title">InventoScan Design System Test</h1>
        <p className="design-test-subtitle">Alle UI-Komponenten im Überblick</p>
      </div>

      {/* Buttons Section */}
      <Card className="design-test-section">
        <CardHeader title="Buttons" subtitle="Verschiedene Button-Varianten und Größen" />
        <CardBody>
          <div className="component-grid">
            <div className="component-group">
              <h4>Varianten</h4>
              <div className="button-row">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
            <div className="component-group">
              <h4>Größen</h4>
              <div className="button-row">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div className="component-group">
              <h4>Zustände</h4>
              <div className="button-row">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button icon={<span>🚀</span>}>With Icon</Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Input Components */}
      <Card className="design-test-section">
        <CardHeader title="Input Components" subtitle="Formulareingaben und Textfelder" />
        <CardBody>
          <div className="component-grid">
            <Input 
              label="Email Address" 
              type="email"
              placeholder="name@example.com"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="We'll never share your email"
            />
            <Input 
              label="Password" 
              type="password"
              placeholder="Enter password"
              error="Password must be at least 8 characters"
            />
            <Textarea 
              label="Description" 
              placeholder="Enter a detailed description..."
              rows={4}
            />
          </div>
        </CardBody>
      </Card>

      {/* Badges */}
      <Card className="design-test-section">
        <CardHeader title="Badges" subtitle="Status und Label Komponenten" />
        <CardBody>
          <BadgeGroup>
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
          </BadgeGroup>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <BadgeGroup>
              <Badge variant="primary" pill>Pill Badge</Badge>
              <Badge variant="success" dot>With Dot</Badge>
              <Badge size="sm">Small</Badge>
              <Badge size="lg">Large</Badge>
            </BadgeGroup>
          </div>
        </CardBody>
      </Card>

      {/* Alerts */}
      <Card className="design-test-section">
        <CardHeader title="Alerts" subtitle="Benachrichtigungen und Warnungen" />
        <CardBody>
          <div className="component-stack">
            {alertVisible && (
              <Alert 
                variant="info" 
                title="Information"
                dismissible
                onDismiss={() => setAlertVisible(false)}
              >
                This is an informational alert message.
              </Alert>
            )}
            <Alert variant="success" title="Success">
              Your changes have been saved successfully!
            </Alert>
            <Alert variant="warning" title="Warning">
              Please review your input before continuing.
            </Alert>
            <Alert variant="danger" title="Error">
              An error occurred while processing your request.
            </Alert>
          </div>
        </CardBody>
      </Card>

      {/* Progress & Loading */}
      <Card className="design-test-section">
        <CardHeader title="Progress & Loading" subtitle="Ladezustände und Fortschrittsanzeigen" />
        <CardBody>
          <div className="component-stack">
            <Progress value={65} max={100} showLabel />
            <Progress value={30} max={100} showLabel variant="gradient" />
            
            <div className="loader-row">
              <Loader size="sm" variant="spinner" />
              <Loader size="md" variant="dots" />
              <Loader size="lg" variant="pulse" />
              <Loader size="md" variant="bars" />
            </div>

            <div className="spinner-row">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="xl" />
            </div>

            <div className="skeleton-group">
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="rect" width="100%" height={100} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Cards */}
      <Card className="design-test-section">
        <CardHeader title="Cards" subtitle="Container Komponenten" />
        <CardBody>
          <div className="card-grid">
            <Card hoverable>
              <CardHeader title="Hoverable Card" subtitle="Hover for effect" />
              <CardBody>
                This card has a hover effect with transform and glow.
              </CardBody>
            </Card>
            
            <Card variant="elevated">
              <CardHeader title="Elevated Card" />
              <CardBody>
                This card has an elevated shadow effect.
              </CardBody>
            </Card>

            <Card variant="outlined">
              <CardHeader 
                title="Outlined Card" 
                action={<Button size="sm">Action</Button>}
              />
              <CardBody>
                This card has a purple border outline.
              </CardBody>
              <CardFooter>
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button variant="primary" size="sm">Save</Button>
              </CardFooter>
            </Card>
          </div>
        </CardBody>
      </Card>

      {/* Empty State */}
      <Card className="design-test-section">
        <CardHeader title="Empty State" subtitle="Leere Zustände" />
        <CardBody>
          <EmptyState
            title="No items found"
            description="Start by adding your first item to the inventory"
            action={
              <Button variant="primary">
                Add First Item
              </Button>
            }
          />
        </CardBody>
      </Card>

      {/* Modal & Dialog */}
      <Card className="design-test-section">
        <CardHeader title="Modal & Dialog" subtitle="Overlay Komponenten" />
        <CardBody>
          <div className="button-row">
            <Button onClick={() => setModalOpen(true)}>
              Open Modal
            </Button>
            <Button variant="secondary" onClick={() => setDialogOpen(true)}>
              Open Dialog
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Example Modal"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Save Changes
            </Button>
          </>
        }
      >
        <p>This is a modal dialog with customizable content.</p>
        <p>You can add any content here including forms and other components.</p>
      </Modal>

      {/* Dialog */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => setDialogOpen(false)}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
        type="warning"
        confirmText="Proceed"
        cancelText="Cancel"
      />

      {/* Color Palette Preview */}
      <Card className="design-test-section">
        <CardHeader title="Color Palette" subtitle="Design System Farben" />
        <CardBody>
          <div className="color-grid">
            <div className="color-item">
              <div className="color-swatch" style={{ background: 'var(--primary-purple)' }} />
              <span>Primary Purple</span>
            </div>
            <div className="color-item">
              <div className="color-swatch" style={{ background: 'var(--bg-dark-primary)' }} />
              <span>Dark Primary</span>
            </div>
            <div className="color-item">
              <div className="color-swatch" style={{ background: 'var(--bg-card)' }} />
              <span>Card BG</span>
            </div>
            <div className="color-item">
              <div className="color-swatch" style={{ background: 'var(--success)' }} />
              <span>Success</span>
            </div>
            <div className="color-item">
              <div className="color-swatch" style={{ background: 'var(--warning)' }} />
              <span>Warning</span>
            </div>
            <div className="color-item">
              <div className="color-swatch" style={{ background: 'var(--error)' }} />
              <span>Error</span>
            </div>
            <div className="color-item">
              <div className="color-swatch gradient-purple" />
              <span>Gradient</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}