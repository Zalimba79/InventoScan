# 📸 Kamera-Zugriff auf iPhone aktivieren

## Problem: "Kamera verweigert Zugriff"

Safari erlaubt Kamera-Zugriff nur über HTTPS oder localhost.

## ✅ LÖSUNG: HTTPS aktivieren

### 1. Frontend mit HTTPS starten:
```bash
cd /Users/enricomaihack/Development/InventoScan/frontend
npm run dev
```

### 2. Auf iPhone öffnen:
- Safari öffnen
- URL: **`https://10.2.0.13:5173`** (mit https://)
- **WICHTIG:** Zertifikat-Warnung erscheint

### 3. Zertifikat akzeptieren:
- "Details anzeigen" tippen
- "Diese Website besuchen" tippen
- "Website besuchen" bestätigen

### 4. Kamera-Berechtigung:
- App öffnet sich
- "Mobile" Tab wählen (unten in der Navigation)
- "📷 Kamera starten" tippen
- Safari fragt nach Kamera-Erlaubnis → "Erlauben"

## Alternative: ngrok (Empfohlen)

### Installation & Start:
```bash
# ngrok installieren (einmalig)
brew install ngrok

# HTTPS Tunnel erstellen
ngrok http 5173
```

### Auf iPhone:
- ngrok URL kopieren (z.B. `https://abc123.ngrok-free.app`)
- In Safari öffnen
- Keine Zertifikat-Warnung!
- Kamera funktioniert direkt

## Weitere Berechtigungen

### Mikrofon (für Sprachbefehle):
- Beim ersten "Spracherkennung starten"
- Safari fragt → "Erlauben"

### Bewegungssensor (für Schüttel-Geste):
- Einstellungen → Safari → Bewegung & Ausrichtung → AN
- Oder beim ersten Schütteln erlauben

## Troubleshooting

### Kamera zeigt schwarzes Bild:
- App schließen und neu laden
- Cache löschen: Einstellungen → Safari → Verlauf löschen

### "Keine sichere Verbindung":
- Stelle sicher dass du `https://` verwendest
- Nicht `http://`

### Berechtigungen zurücksetzen:
- Einstellungen → Safari → Erweitert → Website-Daten → inventoscan löschen
- Einstellungen → Safari → Kamera/Mikrofon → Alle zurücksetzen

## App ist jetzt Mobile-optimiert:

✅ **Responsive Design** - Keine verschiebenden Elemente mehr
✅ **Touch-optimierte Navigation** - Bottom Navigation Bar
✅ **PWA-fähig** - Als App installierbar
✅ **Offline-Support** - Funktioniert ohne Internet
✅ **Kamera/Mikrofon** - Volle Sensor-Integration