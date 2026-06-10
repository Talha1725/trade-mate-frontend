# Trade Mate Frontend Deployment

## EC2 path

Expected checkout path on the server:

`/home/ec2-user/projects/trade-mate-frontend`

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
