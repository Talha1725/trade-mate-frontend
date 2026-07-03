#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "[frontend] pulling latest code from origin/main"
git pull --ff-only origin main

echo "[frontend] installing dependencies"
npm install

echo "[frontend] building production bundle"
npm run build

echo "[frontend] restarting PM2 app"
pm2 startOrRestart ecosystem.config.cjs --update-env

echo "[frontend] saving PM2 process list"
pm2 save

echo "[frontend] deploy complete"