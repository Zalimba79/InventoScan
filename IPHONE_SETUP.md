# 📱 InventoScan auf iPhone installieren

## Methode 1: Lokales Netzwerk (Entwicklung)

### Voraussetzungen:
- Mac und iPhone im gleichen WLAN
- Docker läuft lokal

### Installation:

1. **Services starten:**
```bash
cd /Users/enricomaihack/Development/InventoScan
docker-compose up -d
```

2. **Frontend im Dev-Modus starten:**
```bash
cd frontend
npm run dev
```

3. **Auf iPhone öffnen:**
   - Safari öffnen
   - URL eingeben: `http://10.2.0.13:5173`
   - Warten bis App lädt

4. **Als App installieren:**
   - Tap auf "Teilen" Button (□↑)
   - "Zum Home-Bildschirm" wählen
   - Name bestätigen → "Hinzufügen"

### Features testen:
- **Kamera:** "Mobile" Tab → "Kamera starten"
- **Sprachbefehl:** "Neuer Artikel" sagen
- **Schütteln:** Gerät schütteln für neues Produkt

---

## Methode 2: ngrok Tunnel (Von überall)

### Installation:
```bash
# ngrok installieren (falls noch nicht vorhanden)
brew install ngrok

# Frontend tunneln
ngrok http 5173

# Kopiere die https URL (z.B. https://abc123.ngrok.io)
```

### Auf iPhone:
- Safari öffnen
- ngrok URL eingeben
- Als App installieren (siehe oben)

---

## Methode 3: Production Deploy

### Auf deinem Server (inventoscan.mindbit.net):

1. **SSL/HTTPS aktivieren** (wichtig für Kamera-Zugriff)
2. **Deploy mit Docker:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Auf iPhone:**
   - https://inventoscan.mindbit.net öffnen
   - Als App installieren

---

## Troubleshooting

### Kamera funktioniert nicht?
- Nur über HTTPS oder localhost
- Safari → Einstellungen → Kamera → Erlauben

### Spracherkennung geht nicht?
- Einstellungen → Safari → Mikrofon erlauben
- Nur auf Deutsch: "Neuer Artikel"

### Schütteln reagiert nicht?
- Einstellungen → Safari → Bewegung & Ausrichtung erlauben

### App lädt nicht?
- Firewall prüfen (Port 5173 und 8000 offen?)
- iPhone und Mac im gleichen Netzwerk?

---

## Mobile Features

### Produkttrennung:
- **Button:** "Neues Produkt" antippen
- **Sprache:** "Neuer Artikel" sagen
- **Geste:** Gerät schütteln
- **Automatisch:** KI erkennt verschiedene Produkte

### Batch Upload:
- Mehrere Fotos auswählen
- Automatische Gruppierung
- Session-basierte Ordnerstruktur

### Offline-Modus:
- App funktioniert ohne Internet
- Bilder werden lokal gespeichert
- Upload wenn wieder online

---

## Entwickler-Tipps

### Live-Reload aktivieren:
```bash
# Frontend mit Hot-Reload
npm run dev -- --host

# Backend mit Auto-Reload
docker-compose up backend
```

### Remote Debugging:
1. iPhone → Einstellungen → Safari → Erweitert → Web Inspector: AN
2. Mac → Safari → Entwickler → [iPhone Name]
3. Console und Netzwerk debuggen

### Performance testen:
- Chrome DevTools → Lighthouse
- Mobile Throttling simulieren
- PWA Checklist durchgehen