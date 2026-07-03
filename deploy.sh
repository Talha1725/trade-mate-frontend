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
pm2 delete trade-mate-frontend >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs --update-env

echo "[frontend] verifying PM2 app"
sleep 2
if ! pm2 jlist | node -e '
  let input = "";
  process.stdin.on("data", (chunk) => { input += chunk; });
  process.stdin.on("end", () => {
    const app = JSON.parse(input).find((item) => item.name === "trade-mate-frontend");
    process.exit(app?.pm2_env?.status === "online" ? 0 : 1);
  });
'; then
  echo "[frontend] PM2 app failed to stay online"
  pm2 logs trade-mate-frontend --lines 50 --nostream
  exit 1
fi

echo "[frontend] saving PM2 process list"
pm2 save

echo "[frontend] deploy complete"
