# iOS Camera Setup für InventoScan

## 📱 Problem
iOS Safari erlaubt Kamerazugriff nur über HTTPS-Verbindungen aus Sicherheitsgründen.

## ✅ Lösungen

### Option 1: Lokale HTTPS-Entwicklung

1. **Server neu starten** (HTTPS ist jetzt in vite.config.ts aktiviert):
```bash
npm run dev
```

2. **Zugriff über HTTPS**:
   - Browser öffnen: `https://localhost:5173`
   - Sicherheitswarnung akzeptieren (selbst-signiertes Zertifikat)

3. **iOS Gerät im gleichen Netzwerk**:
   - IP-Adresse deines Macs finden: `ifconfig | grep "inet "`
   - Auf iOS: `https://[DEINE-IP]:5173`
   - Zertifikat akzeptieren

### Option 2: Cloudflare Tunnel (Empfohlen für Production)

Die App ist bereits für Cloudflare Tunnel konfiguriert:
- URL: `https://inventoscan.mindbit.net`
- Automatisches HTTPS
- Funktioniert überall

### Option 3: ngrok für temporäre Tests

```bash
# ngrok installieren
brew install ngrok

# Tunnel starten
ngrok http 5173

# Verwende die https://xxx.ngrok.io URL
```

## 🔧 Vite Konfiguration

Die `vite.config.ts` ist bereits konfiguriert:
```typescript
server: {
  https: true, // HTTPS aktiviert
  host: '0.0.0.0', // Von externen Geräten erreichbar
}
```

## 📸 Camera Features in der App

### Verfügbare Tabs im Capture-Menü:
1. **Camera** - Live-Kamera für Produktfotos
2. **Upload** - Datei-Upload Alternative
3. **Barcode Scanner** - Barcode-Erfassung
4. **Batch Upload** - Mehrfach-Upload

### Unterstützte Features:
- Front/Back Kamera Wechsel
- Flash/Torch Control
- Photo Capture
- File Upload als Fallback

## 🎯 Testing auf iOS

1. **Safari auf iOS öffnen**
2. **HTTPS-URL eingeben**
3. **Zertifikat akzeptieren**
4. **"Capture" im Menü wählen**
5. **Kamera-Zugriff erlauben**

## ⚠️ Wichtige Hinweise

- **HTTP funktioniert NICHT** für Kamera auf iOS
- **Selbst-signierte Zertifikate** müssen manuell akzeptiert werden
- **Private Mode** in Safari kann Probleme verursachen
- **iOS 14.3+** erforderlich für beste Kompatibilität

## 🐛 Troubleshooting

### "Kamera nicht verfügbar"
- Prüfe HTTPS-Verbindung
- Prüfe Kamera-Berechtigungen in iOS Settings
- Cache leeren und neu laden

### "Insecure Connection"
- Zertifikat im Browser akzeptieren
- Oder Cloudflare Tunnel verwenden

### "Permission Denied"
- Settings → Safari → Camera → Allow
- Settings → Privacy → Camera → Safari aktivieren