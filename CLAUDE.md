# Claude Code Memory für InventoScan

## 🎯 WICHTIG: Bei JEDEM neuen Feature

### 1. VOR der Implementierung prüfen:
- [ ] Existiert bereits eine UI-Komponente in `/components/ui`?
- [ ] Ist `design-tokens.css` importiert?
- [ ] Wurde die CLAUDE_CODE_CHECKLIST.md gelesen?

### 2. WÄHREND der Implementierung:
```bash
# Führe diese Checks automatisch aus:
npm run lint:css     # Prüft CSS-Variablen
npm run check:design  # Validiert Design System
npm run test:ui      # Testet UI-Komponenten
```

### 3. NACH der Implementierung:
```bash
# Automatische Validierung:
npm run validate:feature
```

## 🔍 Automatische Tests die ich durchführen MUSS:

### CSS Validation
```bash
# Prüfe auf hardcoded Farben
grep -r "#[0-9a-fA-F]\{3,6\}" --include="*.css" --include="*.tsx" frontend/src/components/
# Sollte KEINE Ergebnisse liefern (außer in design-tokens.css)
```

### Design Token Usage
```bash
# Prüfe ob design-tokens verwendet werden
grep -r "var(--" --include="*.css" frontend/src/components/ | wc -l
# Sollte > 0 sein für neue Komponenten
```

### UI Component Import Check
```bash
# Prüfe ob UI-Komponenten verwendet werden
grep -r "from ['\"].*\/ui" --include="*.tsx" frontend/src/components/
```

## 📋 Feature Completion Checklist

Bevor ich sage "Feature ist fertig", MUSS ich:

1. **Design System Compliance**
   - [ ] Keine hardcoded Farben
   - [ ] Alle Spacings mit var(--space-*)
   - [ ] Hover-Effekte implementiert
   - [ ] Dark Theme funktioniert

2. **Component Usage**
   - [ ] UI-Komponenten verwendet wo möglich
   - [ ] Keine Duplikation von existierenden Komponenten
   - [ ] TypeScript Types korrekt verwendet

3. **Testing**
   - [ ] Component rendert in DesignTest.tsx
   - [ ] Responsive Design getestet
   - [ ] Hover/Active States funktionieren

4. **Code Quality**
   - [ ] ESLint keine Fehler
   - [ ] TypeScript keine Fehler
   - [ ] CSS validiert

## 🚀 Automatische Kommandos

### Bei jedem neuen Feature automatisch ausführen:
```bash
# 1. Lint Check
npm run lint

# 2. Type Check  
npm run typecheck

# 3. Build Test
npm run build

# 4. Design System Check (wenn vorhanden)
npm run check:design
```

## 🔧 Setup für automatische Validierung

### Package.json Scripts hinzufügen:
```json
{
  "scripts": {
    "check:design": "node scripts/check-design-system.js",
    "validate:feature": "npm run lint && npm run typecheck && npm run check:design",
    "lint:css": "stylelint 'frontend/src/**/*.css'",
    "test:ui": "vitest run --dir frontend/src/components/ui"
  }
}
```

## 📝 Notizen für mich selbst (Claude):

- IMMER die DesignTest.tsx aktualisieren wenn neue Komponenten hinzugefügt werden
- NIEMALS hardcoded Farben verwenden
- BEI JEDEM Feature die Checkliste durchgehen
- VOR dem "Fertig" immer validate:feature ausführen

## 🎨 Design System Regeln

### Farben - NUR diese verwenden:
- Background: `var(--bg-dark-primary)`
- Cards: `var(--bg-card)` 
- Borders: `var(--border-default)`
- Primary: `var(--primary-purple)`
- Gradient: `var(--gradient-purple)`
- Text: `var(--text-primary)`, `var(--text-secondary)`

### Komponenten - IMMER prüfen:
```javascript
import { Button, Card, Input, Modal, Badge, Alert, Loader, Spinner, EmptyState } from '@/components/ui'
```

## 🤖 Automatische Antwort-Templates

### Wenn ich ein neues Feature erstelle:
```
✅ Feature implementiert mit:
- Design System konformen Komponenten
- CSS-Variablen aus design-tokens.css
- UI-Komponenten aus /components/ui
- Hover-Effekte und Transitions
- Dark Theme Kompatibilität

Getestet mit:
- npm run lint ✅
- npm run typecheck ✅
- npm run check:design ✅
```

### Wenn ich CSS schreibe:
```css
/* RICHTIG - So sollte es aussehen: */
.component {
  background: var(--bg-card);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
}

/* FALSCH - Das darf NIE passieren: */
.component {
  background: #1E1333;  /* ❌ KEINE hardcoded Farben! */
  padding: 24px;        /* ❌ KEIN hardcoded Spacing! */
}
```