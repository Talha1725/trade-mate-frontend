# Trade Mate Frontend Deployment

## EC2 path

The ecosystem file resolves the checkout path dynamically from its own
directory, so the repository can be deployed from any server path.

## Required env

Create a production env file or export these variables before starting the app:

- `NEXT_PUBLIC_BACKEND_URL`

## Install

```bash
npm install
npm run build
```

## PM2

Start with the ecosystem file:

```bash
pm2 start ecosystem.config.cjs
pm2 save
```

## Notes

- The app must be built before `next start`.
- Keep `NEXT_PUBLIC_BACKEND_URL` pointed at the backend host that the browser can reach.
- The frontend PM2 app runs on port `3100` internally.
