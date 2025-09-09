# 🔒 InventoScan mit Cloudflare Tunnel & Let's Encrypt

## Übersicht
Wir erstellen eine sichere HTTPS-Verbindung über Cloudflare Tunnel zu deiner lokalen Entwicklungsumgebung.

## Vorteile:
✅ **Echtes SSL-Zertifikat** (kein Selbst-signiert)
✅ **Funktioniert auf allen Geräten** (iPhone, iPad, Android)
✅ **Kamera/Mikrofon funktionieren** sofort
✅ **Kein Port-Forwarding** nötig
✅ **Automatisches Let's Encrypt** Zertifikat

## Setup Schritt-für-Schritt:

### 1. Cloudflare Account & Domain
- Login: https://dash.cloudflare.com
- Domain: `inventoscan.mindbit.net` (oder Subdomain)

### 2. Cloudflare Tunnel erstellen

#### Option A: Cloudflare Dashboard (Einfach)
1. Zero Trust → Access → Tunnels
2. "Create a tunnel" → Name: `inventoscan-dev`
3. Install connector auf Mac:
```bash
brew install cloudflared
```

4. Authenticate:
```bash
cloudflared tunnel login
```

5. Tunnel erstellen:
```bash
cloudflared tunnel create inventoscan-dev
```

6. Config erstellen (`~/.cloudflared/config.yml`):
```yaml
tunnel: <TUNNEL-ID>
credentials-file: /Users/enricomaihack/.cloudflared/<TUNNEL-ID>.json

ingress:
  # Frontend
  - hostname: inventoscan.mindbit.net
    service: http://localhost:5173
    originRequest:
      noTLSVerify: true
  
  # Backend API
  - hostname: api.inventoscan.mindbit.net
    service: http://localhost:8000
    
  # Catch-all
  - service: http_status:404
```

7. Route in Cloudflare DNS:
```bash
cloudflared tunnel route dns inventoscan-dev inventoscan.mindbit.net
cloudflared tunnel route dns inventoscan-dev api.inventoscan.mindbit.net
```

8. Tunnel starten:
```bash
cloudflared tunnel run inventoscan-dev
```

### 3. Alternative: Quick Tunnel (Ohne Account)
```bash
# Frontend tunneln (temporäre URL)
cloudflared tunnel --url http://localhost:5173

# Gibt dir eine URL wie: https://random-name.trycloudflare.com
```

### 4. Frontend anpassen für Production Domain

Erstelle `.env.production`:
```env
VITE_API_URL=https://api.inventoscan.mindbit.net
```

Update `frontend/src/services/api.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://api.inventoscan.mindbit.net'
    : window.location.hostname === 'localhost'
      ? 'http://localhost:8000'
      : `http://${window.location.hostname}:8000`);
```

### 5. CORS für neue Domain erlauben

Update `backend/app.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://inventoscan.mindbit.net",
        "https://api.inventoscan.mindbit.net"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Start-Script erstellen:

```bash
#!/bin/bash
# start-tunnel.sh

echo "Starting InventoScan with Cloudflare Tunnel..."

# Start Docker services
docker-compose up -d

# Start Frontend
cd frontend && npm run dev &

# Start Cloudflare Tunnel
cloudflared tunnel run inventoscan-dev

echo "✅ InventoScan läuft auf https://inventoscan.mindbit.net"
```

## Auf iPhone nutzen:

1. Safari öffnen
2. https://inventoscan.mindbit.net
3. **Keine Zertifikat-Warnung!**
4. Kamera/Mikrofon funktionieren sofort
5. Als App installieren

## Bonus: Eigene Domain mit Let's Encrypt

Wenn du volle Kontrolle willst:

### 1. Nginx Reverse Proxy mit Certbot:
```bash
# Nginx installieren
brew install nginx

# Certbot installieren
brew install certbot
```

### 2. Nginx Config (`/usr/local/etc/nginx/servers/inventoscan.conf`):
```nginx
server {
    listen 443 ssl http2;
    server_name inventoscan.local;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:8000;
    }
}
```

### 3. Lokales DNS (für Entwicklung):
```bash
# /etc/hosts bearbeiten
sudo nano /etc/hosts

# Zeile hinzufügen:
127.0.0.1 inventoscan.local
```

## Troubleshooting:

### Tunnel verbindet nicht:
```bash
# Status prüfen
cloudflared tunnel list
cloudflared tunnel info inventoscan-dev

# Logs anschauen
cloudflared tunnel run inventoscan-dev --loglevel debug
```

### Domain nicht erreichbar:
- DNS Propagation checken: https://dnschecker.org
- Cloudflare DNS Settings prüfen (Proxy aktiviert?)

### Kamera funktioniert nicht:
- Muss HTTPS sein (check!)
- Domain muss gültig sein (check!)
- Safari Einstellungen prüfen

## Vorteile dieser Lösung:

✅ **Professionell** - Echte Domain mit SSL
✅ **Sicher** - End-to-End verschlüsselt
✅ **Flexibel** - Von überall erreichbar
✅ **Entwicklerfreundlich** - Hot-Reload funktioniert
✅ **iOS-kompatibel** - Keine Zertifikat-Warnungen