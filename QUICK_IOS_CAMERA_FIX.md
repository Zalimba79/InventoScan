# 🚀 Schnelle iOS Kamera-Lösung

## Problem
iOS Safari blockiert Kamera-Zugriff über HTTP (localhost:5173)

## Schnellste Lösung: ngrok

### 1. Installation (einmalig)
```bash
# Mit Homebrew
brew install ngrok

# Oder direkt Download
# https://ngrok.com/download
```

### 2. Tunnel starten
```bash
# In einem neuen Terminal:
ngrok http 5173
```

### 3. HTTPS-URL verwenden
```
Forwarding: https://abc123.ngrok.io -> localhost:5173
            ^^^^^^^^^^^^^^^^^^^^^^
            Diese URL auf iOS verwenden!
```

### 4. Auf iOS öffnen
1. Safari öffnen
2. ngrok HTTPS-URL eingeben
3. Capture → Camera wählen
4. Kamera-Zugriff erlauben ✅

## Alternative: Cloudflare Tunnel (bereits konfiguriert)

### Start Cloudflare Tunnel:
```bash
# Tunnel starten
cloudflared tunnel run inventoscan-dev

# Oder mit Quick-Tunnel (ohne Setup):
cloudflared tunnel --url http://localhost:5173
```

### Dann auf iOS:
- `https://inventoscan.mindbit.net` (wenn konfiguriert)
- Oder die temporäre URL vom Quick-Tunnel

## Alternative: localtunnel

### Installation & Start:
```bash
# Installation
npm install -g localtunnel

# Tunnel starten
lt --port 5173 --subdomain inventoscan

# Öffne auf iOS:
# https://inventoscan.loca.lt
```

## Was funktioniert NICHT:
❌ http://localhost:5173
❌ http://10.2.0.13:5173
❌ Jede HTTP (nicht HTTPS) Verbindung

## Was funktioniert:
✅ ngrok HTTPS URLs
✅ Cloudflare Tunnel URLs
✅ localtunnel HTTPS URLs
✅ Jede gültige HTTPS URL

## Empfehlung für Development:
1. **ngrok** - Am schnellsten, keine Konfiguration
2. **Cloudflare Tunnel** - Beste Performance, eigene Domain
3. **localtunnel** - Open Source Alternative