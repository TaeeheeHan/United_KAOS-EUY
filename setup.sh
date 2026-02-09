#!/usr/bin/env bash
set -e

echo "============================================"
echo "  KAOS EUY - Setup & Run"
echo "============================================"

# 1. Check prerequisites
for cmd in docker node npx; do
  if ! command -v $cmd &> /dev/null; then
    echo "ERROR: '$cmd' is not installed. Please install it first."
    exit 1
  fi
done

# 2. Create .env.local if missing
if [ ! -f .env.local ]; then
  echo "Creating .env.local from .env.example ..."
  cp .env.example .env.local
  echo "  -> .env.local created. Edit it if you need custom values."
fi

# 3. Start Supabase (local DB, Auth, Storage via Docker)
echo ""
echo "[1/3] Starting Supabase ..."
npx --yes supabase start

# 4. Run migrations & seed admin
echo ""
echo "[2/3] Running migrations & seeding admin ..."
npx --yes supabase db reset
npm install --silent
node scripts/seed-admin.mjs 2>/dev/null || true

# 5. Build & start Next.js via Docker Compose
echo ""
echo "[3/3] Building & starting Next.js (Docker) ..."
docker compose up --build -d

echo ""
echo "============================================"
echo "  All done!"
echo "  Web app  : http://localhost:3000"
echo "  Supabase : http://localhost:54323  (Studio)"
echo "============================================"
