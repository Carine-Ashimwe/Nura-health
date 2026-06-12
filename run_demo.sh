#!/usr/bin/env bash
# Nura Health — one-command demo launcher.
#   Backend  : Python FastAPI ML service  -> http://127.0.0.1:8000  (Swagger: /docs)
#   Frontend : Next.js 14 mobile PWA       -> http://127.0.0.1:3000
# Press Ctrl+C to stop both.
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$ROOT/nurahealth_backend"
FRONTEND="$ROOT/nurahealth_frontend"

# --- Backend Python (use the backend venv, create it if missing) ---
PY="$BACKEND/venv/bin/python"
if [ ! -x "$PY" ]; then
  echo "Creating backend venv and installing requirements..."
  python3 -m venv "$BACKEND/venv"
  PY="$BACKEND/venv/bin/python"
  "$PY" -m pip install --quiet --upgrade pip
  "$PY" -m pip install --quiet -r "$BACKEND/requirements.txt"
fi

# --- Frontend Node (install deps + prepare local SQLite db on first run) ---
if [ ! -d "$FRONTEND/node_modules" ]; then
  echo "Installing frontend dependencies (first run, may take a minute)..."
  ( cd "$FRONTEND" && npm install )
fi
if [ ! -f "$FRONTEND/prisma/dev.db" ]; then
  echo "Preparing the local database and demo account..."
  ( cd "$FRONTEND" && npx prisma db push --skip-generate && node scripts/seed.mjs )
fi

# Free the ports in case a previous run (or test server) is still bound to them.
lsof -ti :8000 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -ti :3000 2>/dev/null | xargs kill -9 2>/dev/null || true

cleanup() { echo; echo "Stopping..."; kill 0 2>/dev/null; }
trap cleanup EXIT INT TERM

echo "Starting backend  -> http://127.0.0.1:8000  (Swagger: /docs)"
( cd "$BACKEND" && "$PY" -m uvicorn api.main:app --host 127.0.0.1 --port 8000 ) &

sleep 3

echo "Starting frontend -> http://127.0.0.1:3000"
# -H 0.0.0.0 lets phones / other devices on the same Wi-Fi reach the app.
( cd "$FRONTEND" && npm run dev -- -H 0.0.0.0 -p 3000 ) &

# Best-effort: show this machine's Wi-Fi address for phone testing.
LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || true)"

echo
echo "Nura Health is running."
echo "  On this Mac : http://127.0.0.1:3000"
[ -n "$LAN_IP" ] && echo "  On your phone (same Wi-Fi): http://$LAN_IP:3000"
echo "Demo login: demo.chw@nura.rw / Demo@12345"
echo "Press Ctrl+C to stop."
wait
