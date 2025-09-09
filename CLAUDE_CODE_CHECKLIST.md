# Claude Code Checkliste für InventoScan

## 🎯 Bei JEDER Komponente:
- [ ] Verwende NUR CSS-Variablen aus `design-tokens.css`
- [ ] KEINE hardcoded Farben (#xxx oder rgb())
- [ ] Nutze UI-Komponenten aus `/components/ui`
- [ ] Dark background: `var(--bg-dark-primary)`
- [ ] Cards: `var(--bg-card)` mit `border: var(--border-default)`
- [ ] Hover-Effekte mit `transform` und `box-shadow: var(--shadow-glow)`

## 🎨 Farben-Mapping:
```css
/* Alte Farbe → Neue Variable */
#ffffff → var(--text-primary)
#000000 → var(--bg-dark-primary)
Grau-Töne → var(--text-secondary) oder var(--text-tertiary)
Blau/Primär → var(--primary-purple)
Gradient → var(--gradient-purple)
Grün → var(--success)
Rot → var(--error)
Gelb → var(--warning)
Info → var(--info)
```

## 📦 Import UI-Komponenten:
```javascript
// Verwende IMMER die vorgefertigten Komponenten:
import { 
  Button, 
  Card, 
  Input, 
  Modal,
  Badge, 
  Alert,
  Loader,
  Spinner,
  EmptyState 
} from '@/components/ui'
```

## 🚫 NICHT MEHR VERWENDEN:
- `BaseComponents.tsx` / `BaseComponents.css` (veraltet)
- Eigene Button/Card/Input Implementierungen
- Inline Styles mit Farben
- Hardcoded Spacings (verwende `var(--space-*)`)

## ✅ Standard-Struktur für neue Komponenten:
```tsx
import React from 'react'
import './ComponentName.css'  // Component-spezifische Styles
import { Button, Card } from '@/components/ui'  // UI-Komponenten

export const ComponentName: React.FC = () => {
  return (
    <div className="component-container">
      <Card hoverable padding="md">
        <h2>Title</h2>
        <Button variant="primary">Action</Button>
      </Card>
    </div>
  )
}
```

## 🎨 CSS-Template für neue Komponenten:
```css
/* ComponentName.css */

.component-container {
  padding: var(--space-6);
  background: var(--bg-dark-primary);
}

.component-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all var(--transition-base) var(--ease-in-out);
}

.component-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}
```

## 📐 Spacing-System:
```css
/* Verwende IMMER diese Variablen: */
var(--space-1)  /* 4px */
var(--space-2)  /* 8px */
var(--space-3)  /* 12px */
var(--space-4)  /* 16px */
var(--space-5)  /* 20px */
var(--space-6)  /* 24px */
var(--space-8)  /* 32px */
var(--space-10) /* 40px */
var(--space-12) /* 48px */
```

## 🔄 Transitions:
```css
/* Standard Transition für alle Hover-Effekte: */
transition: all var(--transition-base) var(--ease-in-out);
```

## 🟣 Purple Glow für wichtige CTAs:
```css
.cta-button {
  background: var(--gradient-purple);
  box-shadow: 0 0 30px rgba(141, 123, 251, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(141, 123, 251, 0.4);
}
```

## 📱 Responsive Design:
```css
/* Mobile First Approach */
@media (max-width: 640px) { /* Mobile */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

## ⚠️ WICHTIG:
1. **IMMER** `design-tokens.css` ist bereits global importiert
2. **NIEMALS** neue Farben definieren - nutze vorhandene Variablen
3. **PRÜFE** ob eine UI-Komponente bereits existiert bevor du eigene erstellst
4. **TESTE** Dark Mode Kompatibilität
5. **VERWENDE** TypeScript Types aus den UI-Komponenten

## 🔍 Quick Check vor jedem Commit:
- [ ] Keine hardcoded Farben?
- [ ] Alle Spacings mit var(--space-*)?
- [ ] UI-Komponenten verwendet wo möglich?
- [ ] Hover-Effekte implementiert?
- [ ] Dark Theme funktioniert?