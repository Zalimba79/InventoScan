# Claude Code Instruktionen für InventoScan

## 🚨 KRITISCHE REGELN - NIEMALS ÄNDERN

### Projektstruktur - LOCKED
```
InventoScan/
├── backend/                # FastAPI - NICHT ändern
│   ├── app.py             # Hauptdatei
│   ├── api/               # Endpoints
│   ├── services/          # Business Logic
│   ├── models/            # Datenmodelle
│   └── requirements.txt   # Dependencies
├── frontend/              # React+Vite - NICHT ändern
│   ├── src/
│   │   ├── components/    # React Komponenten
│   │   ├── services/      # API Calls
│   │   └── pages/         # Seiten
│   └── package.json
├── docker-compose.yml     # Development
├── docker-compose.prod.yml # Production
└── [KEINE neuen Top-Level Ordner ohne Rückfrage]
```

### Tech Stack - NICHT ÄNDERN
- **Backend:** FastAPI 0.115.0 (kein Flask, Django, etc.)
- **Frontend:** React 18 + Vite + TypeScript (kein Next.js, CRA, etc.)
- **Styling:** [NOCH ZU DEFINIEREN - Tailwind oder CSS Modules]
- **Database:** PostgreSQL (später)
- **Container:** Docker
- **Package Manager:** npm (kein yarn, pnpm, bun)

### ❌ VERBOTENE ÄNDERUNGEN
- Keine Framework-Wechsel oder "bessere Alternativen"
- Keine Änderung der Ordnerstruktur
- Keine neuen Config-Dateien im Root ohne Rückfrage
- Kein Löschen/Umbenennen existierender Endpoints
- Keine spontanen Package-Updates
- Keine "Refactoring" ohne explizite Anfrage

## 📐 DESIGN SYSTEM

### Farben (noch zu implementieren)
```css
/* Primärfarben */
--primary: #2563eb;      /* blue-600 */
--primary-hover: #1d4ed8; /* blue-700 */

/* Sekundärfarben */
--secondary: #4b5563;    /* gray-600 */
--text: #111827;         /* gray-900 */
--background: #ffffff;
--border: #e5e7eb;       /* gray-200 */

/* Status */
--success: #10b981;      /* green-500 */
--warning: #f59e0b;      /* amber-500 */
--danger: #ef4444;       /* red-500 */
```

### Komponenten-Standards
```typescript
// IMMER diese Struktur für React Components:
interface ComponentNameProps {
  // Props mit TypeScript types
  required: string;
  optional?: boolean;
}

export const ComponentName: React.FC<ComponentNameProps> = ({ 
  required,
  optional = false 
}) => {
  // Hooks am Anfang
  const [state, setState] = useState();
  
  // Event Handler
  const handleAction = () => {
    // Logic
  };
  
  // Render
  return (
    <div className="">
      {/* JSX */}
    </div>
  );
};
```

### API-Call Standards
```typescript
// ALLE API-Calls über frontend/src/services/api.ts
const API_URL = import.meta.env.PROD 
  ? 'https://inventoscan.mindbit.net/api'
  : 'http://localhost:8000';

// Immer mit Error Handling
try {
  const response = await fetch(`${API_URL}/endpoint`);
  if (!response.ok) throw new Error('API Error');
  return await response.json();
} catch (error) {
  console.error('Error:', error);
  // User-friendly error handling
}
```

### Backend Standards
```python
# FastAPI Endpoints immer async
@app.post("/api/endpoint")
async def endpoint_name(
    param: str,
    file: UploadFile = File(None)
) -> dict:
    """
    Docstring mit Beschreibung.
    """
    try:
        # Implementation
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 📋 AKTUELLE FEATURE-LISTE

### ✅ Fertig
- [x] Projekt-Setup
- [x] Docker-Konfiguration
- [x] Deployment-Pipeline

### 🚧 In Arbeit
- [ ] Upload API (`POST /api/upload`)
- [ ] Bild-Vorschau Frontend

### 📅 Geplant
- [ ] OpenAI Vision Integration
- [ ] Barcode Scanner
- [ ] Produktkatalog
- [ ] Datenbank-Integration

## 🔧 ENTWICKLUNGS-WORKFLOW

### Bei JEDER Änderung:
1. **VOR dem Coden:** "Ich möchte Feature X implementieren. Zeige mir erst, welche Dateien du ändern wirst."
2. **Bestätigung abwarten:** Keine Änderungen ohne Zustimmung
3. **Fokussiert bleiben:** NUR das angefragte Feature, keine "Verbesserungen" nebenbei
4. **Testing:** Immer Testcode mitliefern wenn möglich

### Git Commit Messages
```bash
# Format: <type>: <description>
Add: Neue Features
Update: Änderungen an bestehendem Code  
Fix: Bugfixes
Refactor: Code-Verbesserungen (nur auf Anfrage!)
Docs: Dokumentation
Style: Formatierung
```

## 🚫 ANTI-PATTERNS - NICHT MACHEN

1. **"Lass uns zu Next.js wechseln"** → NEIN
2. **"Hier ist eine bessere Struktur"** → NEIN
3. **"Ich habe noch X optimiert"** → NEIN ohne Anfrage
4. **"Modern wäre es mit..."** → Irrelevant
5. **Ungefragt Dependencies hinzufügen** → NEIN

## 📝 BEISPIEL PROMPTS

### ✅ GUTER Prompt:
```
Implementiere die Upload-Funktion:
- POST /api/upload Endpoint in backend/app.py
- Speichere in backend/uploads/
- Nur Bild-Upload, keine weiteren Features
```

### ❌ SCHLECHTER Prompt:
```
Verbessere die App
Mache das Frontend schöner
Optimiere die Performance
```

## 🔄 SYNC MIT GITHUB

Das Projekt liegt unter: https://github.com/Zalimba79/InventoScan

Bei Unklarheiten IMMER:
1. Aktuelle Struktur prüfen
2. Diese Instruktionen lesen
3. Nachfragen statt annehmen

---

**DIESER GUIDE IST VERPFLICHTEND. BEI VERSTÖSSEN WIRD DIE SESSION BEENDET.**