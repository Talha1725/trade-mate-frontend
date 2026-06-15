#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "[frontend] syncing latest code from origin/${CURRENT_BRANCH}"
git fetch origin
git reset --hard "origin/${CURRENT_BRANCH}"
git clean -fd

echo "[frontend] installing dependencies"
npm install

echo "[frontend] building production bundle"
npm run build

echo "[frontend] restarting PM2 app"
pm2 startOrRestart ecosystem.config.cjs --update-env

echo "[frontend] deploy complete"
