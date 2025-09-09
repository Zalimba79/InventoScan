import React, { useState } from 'react';
import { BaseWithTabs, type TabContentData } from './layout';
import { 
  GridIcon, 
  LayersIcon, 
  ButtonIcon, 
  PaletteIcon, 
  TypeIcon 
} from './icons';
import './DesignComponents.css';

// Import all UI components
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
  EmptyState,
  TabNavigation
} from './ui';

// Components Tab Content
const ComponentsContent: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);

  return (
    <div className="components-content">
      {/* Buttons Section */}
      <Card className="design-section">
        <CardHeader title="Buttons" subtitle="Various button styles and sizes" />
        <CardBody>
          <div className="component-grid">
            <div className="component-group">
              <h4>Variants</h4>
              <div className="button-row">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
            <div className="component-group">
              <h4>Sizes</h4>
              <div className="button-row">
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
              </div>
            </div>
            <div className="component-group">
              <h4>States</h4>
              <div className="button-row">
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Forms Section */}
      <Card className="design-section">
        <CardHeader title="Form Elements" subtitle="Input fields and form controls" />
        <CardBody>
          <div className="component-grid">
            <div className="component-group">
              <h4>Text Inputs</h4>
              <Input 
                placeholder="Enter text..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input 
                placeholder="With error" 
                error="This field is required"
              />
              <Input 
                placeholder="Disabled input" 
                disabled
              />
            </div>
            <div className="component-group">
              <h4>Textarea</h4>
              <Textarea 
                placeholder="Enter long text..." 
                rows={4}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Feedback Section */}
      <Card className="design-section">
        <CardHeader title="Feedback" subtitle="Alerts, modals, and notifications" />
        <CardBody>
          <div className="component-grid">
            <div className="component-group">
              <h4>Alerts</h4>
              {alertVisible && (
                <Alert 
                  type="success" 
                  message="Success! Your action was completed."
                  onClose={() => setAlertVisible(false)}
                />
              )}
              <Alert type="warning" message="Warning: Please review your input." />
              <Alert type="error" message="Error: Something went wrong." />
              <Alert type="info" message="Info: Here's some helpful information." />
            </div>
            <div className="component-group">
              <h4>Modals</h4>
              <div className="button-row">
                <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
                <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Loading States */}
      <Card className="design-section">
        <CardHeader title="Loading States" subtitle="Spinners, loaders, and skeletons" />
        <CardBody>
          <div className="component-grid">
            <div className="component-group">
              <h4>Spinners</h4>
              <div className="loader-row">
                <Spinner size="small" />
                <Spinner size="medium" />
                <Spinner size="large" />
              </div>
            </div>
            <div className="component-group">
              <h4>Progress</h4>
              <Progress value={33} />
              <Progress value={66} />
              <Progress value={100} />
            </div>
            <div className="component-group">
              <h4>Skeleton</h4>
              <Skeleton width="100%" height="20px" />
              <Skeleton width="80%" height="20px" />
              <Skeleton width="60%" height="20px" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Badges */}
      <Card className="design-section">
        <CardHeader title="Badges" subtitle="Status indicators and labels" />
        <CardBody>
          <div className="component-grid">
            <div className="component-group">
              <h4>Badge Variants</h4>
              <BadgeGroup>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
              </BadgeGroup>
            </div>
            <div className="component-group">
              <h4>Badge Sizes</h4>
              <BadgeGroup>
                <Badge size="small">Small</Badge>
                <Badge size="medium">Medium</Badge>
                <Badge size="large">Large</Badge>
              </BadgeGroup>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Modals */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Modal Title</h2>
        <p>This is a modal dialog with custom content.</p>
        <div className="modal-actions">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm</Button>
        </div>
      </Modal>

      <Dialog 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
        onConfirm={() => setDialogOpen(false)}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
};

// Cards Tab Content
const CardsContent: React.FC = () => {
  return (
    <div className="cards-content">
      <h2>Card Sizes & Styles</h2>
      
      <div className="size-grid">
        <div className="size-demo">
          <Card className="card-xs">
            <CardBody>
              <span className="size-label">XS</span>
              <span className="size-dims">80px × 160px</span>
            </CardBody>
          </Card>
          <p>Compact metrics</p>
        </div>

        <div className="size-demo">
          <Card className="card-sm">
            <CardBody>
              <span className="size-label">SM</span>
              <span className="size-dims">120px × 240px</span>
            </CardBody>
          </Card>
          <p>Mini cards</p>
        </div>

        <div className="size-demo">
          <Card className="card-md">
            <CardBody>
              <span className="size-label">MD</span>
              <span className="size-dims">160px × 320px</span>
            </CardBody>
          </Card>
          <p>Standard cards</p>
        </div>

        <div className="size-demo">
          <Card className="card-lg">
            <CardBody>
              <span className="size-label">LG</span>
              <span className="size-dims">200px × 400px</span>
            </CardBody>
          </Card>
          <p>Feature cards</p>
        </div>
      </div>

      <h3>Card Styles</h3>
      <div className="style-grid">
        <Card className="card-glass">
          <CardHeader title="Glass Card" />
          <CardBody>Glassmorphism effect with blur</CardBody>
        </Card>

        <Card className="card-gradient">
          <CardHeader title="Gradient Card" />
          <CardBody>Purple gradient background</CardBody>
        </Card>

        <Card className="card-bordered">
          <CardHeader title="Bordered Card" />
          <CardBody>Simple border style</CardBody>
        </Card>
      </div>
    </div>
  );
};

// Layouts Tab Content
const LayoutsContent: React.FC = () => {
  return (
    <div className="layouts-content">
      <h2>Layout Patterns</h2>
      
      <div className="layout-examples">
        <div className="layout-example">
          <h3>Grid Layout</h3>
          <div className="grid-demo">
            <div className="grid-item">1</div>
            <div className="grid-item">2</div>
            <div className="grid-item">3</div>
            <div className="grid-item">4</div>
            <div className="grid-item">5</div>
            <div className="grid-item">6</div>
          </div>
        </div>

        <div className="layout-example">
          <h3>Flex Layout</h3>
          <div className="flex-demo">
            <div className="flex-item flex-1">Flex 1</div>
            <div className="flex-item flex-2">Flex 2</div>
            <div className="flex-item flex-1">Flex 1</div>
          </div>
        </div>

        <div className="layout-example">
          <h3>Dashboard Layout</h3>
          <div className="dashboard-demo">
            <div className="dashboard-header">Header</div>
            <div className="dashboard-body">
              <div className="dashboard-sidebar">Sidebar</div>
              <div className="dashboard-content">Content</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Colors Tab Content
const ColorsContent: React.FC = () => {
  return (
    <div className="colors-content">
      <h2>Color Palette</h2>
      
      <div className="color-section">
        <h3>Primary Colors</h3>
        <div className="color-grid">
          <div className="color-swatch purple-500">
            <span className="color-label">#9D7EF8</span>
            <span className="color-name">Primary Purple</span>
          </div>
          <div className="color-swatch purple-600">
            <span className="color-label">#8B5EE6</span>
            <span className="color-name">Purple 600</span>
          </div>
          <div className="color-swatch purple-700">
            <span className="color-label">#7B42D4</span>
            <span className="color-name">Purple 700</span>
          </div>
        </div>
      </div>

      <div className="color-section">
        <h3>Background Colors</h3>
        <div className="color-grid">
          <div className="color-swatch bg-primary">
            <span className="color-label">#110922</span>
            <span className="color-name">Dark Primary</span>
          </div>
          <div className="color-swatch bg-secondary">
            <span className="color-label">#1A0F2E</span>
            <span className="color-name">Dark Secondary</span>
          </div>
          <div className="color-swatch bg-card">
            <span className="color-label">#1E1333</span>
            <span className="color-name">Card Background</span>
          </div>
        </div>
      </div>

      <div className="color-section">
        <h3>Status Colors</h3>
        <div className="color-grid">
          <div className="color-swatch success">
            <span className="color-label">#10B981</span>
            <span className="color-name">Success</span>
          </div>
          <div className="color-swatch warning">
            <span className="color-label">#F59E0B</span>
            <span className="color-name">Warning</span>
          </div>
          <div className="color-swatch error">
            <span className="color-label">#EF4444</span>
            <span className="color-name">Error</span>
          </div>
          <div className="color-swatch info">
            <span className="color-label">#3B82F6</span>
            <span className="color-name">Info</span>
          </div>
        </div>
      </div>

      <div className="color-section">
        <h3>Gradients</h3>
        <div className="gradient-grid">
          <div className="gradient-swatch gradient-primary">
            <span className="gradient-name">Primary Gradient</span>
          </div>
          <div className="gradient-swatch gradient-purple">
            <span className="gradient-name">Purple Gradient</span>
          </div>
          <div className="gradient-swatch gradient-mesh">
            <span className="gradient-name">Mesh Gradient</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Typography Tab Content
const TypographyContent: React.FC = () => {
  return (
    <div className="typography-content">
      <h2>Typography System</h2>
      
      <div className="type-section">
        <h3>Font Sizes</h3>
        <div className="type-scale">
          <p className="text-xs">text-xs: 0.75rem (12px)</p>
          <p className="text-sm">text-sm: 0.875rem (14px)</p>
          <p className="text-base">text-base: 1rem (16px)</p>
          <p className="text-lg">text-lg: 1.125rem (18px)</p>
          <p className="text-xl">text-xl: 1.25rem (20px)</p>
          <p className="text-2xl">text-2xl: 1.5rem (24px)</p>
          <p className="text-3xl">text-3xl: 1.875rem (30px)</p>
          <p className="text-4xl">text-4xl: 2.25rem (36px)</p>
        </div>
      </div>

      <div className="type-section">
        <h3>Font Weights</h3>
        <div className="type-weights">
          <p style={{ fontWeight: 300 }}>Light (300)</p>
          <p style={{ fontWeight: 400 }}>Regular (400)</p>
          <p style={{ fontWeight: 500 }}>Medium (500)</p>
          <p style={{ fontWeight: 600 }}>Semibold (600)</p>
          <p style={{ fontWeight: 700 }}>Bold (700)</p>
        </div>
      </div>

      <div className="type-section">
        <h3>Headings</h3>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
      </div>

      <div className="type-section">
        <h3>Text Colors</h3>
        <p className="text-primary">Primary text color</p>
        <p className="text-secondary">Secondary text color</p>
        <p className="text-tertiary">Tertiary text color</p>
        <p className="text-muted">Muted text color</p>
      </div>
    </div>
  );
};

// Icons Tab Content  
const IconsContent: React.FC = () => {
  return (
    <div className="icons-content">
      <h2>Icon Library</h2>
      
      <div className="icon-grid">
        <div className="icon-item">
          <GridIcon />
          <span>Grid</span>
        </div>
        <div className="icon-item">
          <LayersIcon />
          <span>Layers</span>
        </div>
        <div className="icon-item">
          <ButtonIcon />
          <span>Button</span>
        </div>
        <div className="icon-item">
          <PaletteIcon />
          <span>Palette</span>
        </div>
        <div className="icon-item">
          <TypeIcon />
          <span>Type</span>
        </div>
      </div>

      <p className="icon-note">
        Icons are implemented as React components for easy customization and consistent sizing.
      </p>
    </div>
  );
};

// All Components List
const ComponentsList: React.FC = () => {
  const uiComponents = [
    { name: 'Alert', path: '/ui/Alert.tsx', description: 'Notification messages and alerts' },
    { name: 'Badge', path: '/ui/Badge.tsx', description: 'Status indicators and labels' },
    { name: 'Button', path: '/ui/Button.tsx', description: 'Interactive button component' },
    { name: 'Card', path: '/ui/Card.tsx', description: 'Container component with header, body, footer' },
    { name: 'EmptyState', path: '/ui/EmptyState.tsx', description: 'Empty state placeholder' },
    { name: 'Input', path: '/ui/Input.tsx', description: 'Text input and textarea components' },
    { name: 'Loader', path: '/ui/Loader.tsx', description: 'Loading indicators and progress bars' },
    { name: 'Modal', path: '/ui/Modal.tsx', description: 'Modal and dialog components' },
    { name: 'Spinner', path: '/ui/Spinner.tsx', description: 'Spinning loader animation' },
    { name: 'TabNavigation', path: '/ui/TabNavigation.tsx', description: 'Tab navigation component' },
  ];

  const layoutComponents = [
    { name: 'BasePage', path: '/layout/BasePage.tsx', description: 'Base page wrapper' },
    { name: 'BaseWithoutNavigation', path: '/layout/BaseWithoutNavigation.tsx', description: 'Page without tabs' },
    { name: 'BaseWithTabs', path: '/layout/BaseWithTabs.tsx', description: 'Page with tab navigation' },
    { name: 'PageBar', path: '/layout/PageBar.tsx', description: 'Large title bar with gradient' },
    { name: 'PageContent', path: '/layout/PageContent.tsx', description: 'Content wrapper component' },
    { name: 'PageHeader', path: '/layout/PageHeader.tsx', description: 'Page header with title and actions' },
    { name: 'PageLayout', path: '/layout/PageLayout.tsx', description: 'Complete page layout structure' },
    { name: 'PageToolbar', path: '/layout/PageToolbar.tsx', description: 'Toolbar for filters and actions' },
  ];

  const pageComponents = [
    { name: 'Administration', path: '/Administration.tsx', description: 'Admin settings page' },
    { name: 'Dashboard', path: '/Dashboard.tsx', description: 'Main dashboard with grid layout' },
    { name: 'DesignComponents', path: '/DesignComponents.tsx', description: 'This design system page' },
    { name: 'MarketplacePanel', path: '/MarketplacePanel.tsx', description: 'Marketplace integration' },
    { name: 'PageBuilder', path: '/PageBuilder.tsx', description: 'Visual page builder' },
    { name: 'ProductDrafts', path: '/ProductDrafts.tsx', description: 'Product management interface' },
    { name: 'SecurityStatus', path: '/SecurityStatus.tsx', description: 'Security monitoring component' },
    { name: 'UploadCenter', path: '/UploadCenter.tsx', description: 'File upload management' },
  ];

  const mobileComponents = [
    { name: 'MobileCapture', path: '/MobileCapture.tsx', description: 'Mobile camera capture' },
    { name: 'MobileDashboard', path: '/MobileDashboard.tsx', description: 'Mobile-optimized dashboard' },
    { name: 'MobileNav', path: '/MobileNav.tsx', description: 'Mobile navigation menu' },
    { name: 'NativeCamera', path: '/NativeCamera.tsx', description: 'Native camera integration' },
  ];

  const utilityComponents = [
    { name: 'CameraCapture', path: '/CameraCapture.tsx', description: 'Camera capture utility' },
    { name: 'ImageUpload', path: '/ImageUpload.tsx', description: 'Image upload handler' },
    { name: 'LogoPreview', path: '/LogoPreview.tsx', description: 'Logo display component' },
    { name: 'ProductGalleryModal', path: '/ProductGalleryModal.tsx', description: 'Product image gallery' },
    { name: 'ProductWizard', path: '/ProductWizard.tsx', description: 'Product creation wizard' },
    { name: 'SplashScreen', path: '/SplashScreen.tsx', description: 'Loading splash screen' },
  ];

  const iconComponents = [
    { name: 'TabIcons', path: '/icons/TabIcons.tsx', description: 'All tab navigation icons' },
  ];

  const ComponentSection = ({ title, components }: { title: string; components: typeof uiComponents }) => (
    <div className="component-section">
      <h3>{title}</h3>
      <div className="component-list">
        {components.map(comp => (
          <div key={comp.name} className="component-item">
            <div className="component-name">{comp.name}</div>
            <div className="component-path">{comp.path}</div>
            <div className="component-desc">{comp.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="components-list-content">
      <h2>All Components Overview</h2>
      <p className="components-summary">
        Total: {uiComponents.length + layoutComponents.length + pageComponents.length + 
                mobileComponents.length + utilityComponents.length + iconComponents.length} components
      </p>

      <ComponentSection title="UI Components" components={uiComponents} />
      <ComponentSection title="Layout Components" components={layoutComponents} />
      <ComponentSection title="Page Components" components={pageComponents} />
      <ComponentSection title="Mobile Components" components={mobileComponents} />
      <ComponentSection title="Utility Components" components={utilityComponents} />
      <ComponentSection title="Icon Components" components={iconComponents} />
    </div>
  );
};

/**
 * DesignComponents - Unified Design System and Components Gallery
 */
export const DesignComponents: React.FC = () => {
  const tabData: TabContentData[] = [
    {
      id: 'components',
      label: 'Components',
      icon: <LayersIcon />,
      content: {
        title: 'UI Components',
        description: 'All interactive components from the design system',
        component: <ComponentsContent />
      }
    },
    {
      id: 'cards',
      label: 'Cards',
      icon: <GridIcon />,
      content: {
        title: 'Card System',
        description: 'Card sizes, styles, and layouts',
        component: <CardsContent />
      }
    },
    {
      id: 'layouts',
      label: 'Layouts',
      icon: <LayersIcon />,
      content: {
        title: 'Layout Patterns',
        description: 'Common layout structures and patterns',
        component: <LayoutsContent />
      }
    },
    {
      id: 'colors',
      label: 'Colors',
      icon: <PaletteIcon />,
      content: {
        title: 'Color Palette',
        description: 'Complete color system and gradients',
        component: <ColorsContent />
      }
    },
    {
      id: 'typography',
      label: 'Typography',
      icon: <TypeIcon />,
      content: {
        title: 'Typography System',
        description: 'Font sizes, weights, and text styles',
        component: <TypographyContent />
      }
    },
    {
      id: 'icons',
      label: 'Icons',
      icon: <GridIcon />,
      content: {
        title: 'Icon Library',
        description: 'Available icons and usage',
        component: <IconsContent />
      }
    },
    {
      id: 'all-components',
      label: 'All Components',
      icon: <LayersIcon />,
      content: {
        title: 'Component Overview',
        description: 'Complete list of all available components',
        component: <ComponentsList />
      }
    }
  ];

  return (
    <BaseWithTabs
      title="Design & Components"
      subtitle="Complete UI design system and component library"
      tabs={tabData}
      defaultTab="components"
    />
  );
};

export default DesignComponents;