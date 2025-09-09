#!/bin/bash

echo "🚀 InventoScan Quick Start mit Cloudflare Tunnel"
echo "================================================"

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "📦 Installiere cloudflared..."
    brew install cloudflared
fi

# Start Docker services
echo "🐳 Starte Docker Services..."
docker-compose up -d

# Wait for services
sleep 5

# Start Frontend in background
echo "⚛️ Starte Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Give frontend time to start
sleep 3

echo ""
echo "🔐 Erstelle sichere Tunnel..."
echo "================================"

# Create tunnel for frontend (this will give us a URL)
echo "Frontend Tunnel wird erstellt..."
cloudflared tunnel --url http://localhost:5174 &
TUNNEL_PID=$!

# Wait a bit for tunnel to establish
sleep 5

echo ""
echo "✅ FERTIG!"
echo "=========="
echo ""
echo "📱 Öffne auf deinem iPhone:"
echo "Die URL wird oben angezeigt (https://...trycloudflare.com)"
echo ""
echo "Keine Zertifikat-Warnung! Kamera funktioniert sofort!"
echo ""
echo "Zum Beenden: Ctrl+C"

# Keep script running
wait $TUNNEL_PID