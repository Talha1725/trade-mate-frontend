module.exports = {
  apps: [
    {
      name: "trade-mate-frontend",
      cwd: __dirname,
      script: "./node_modules/next/dist/bin/next",
      args: "start --hostname 0.0.0.0 --port 3100",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: "3100",
        NEXT_PUBLIC_BACKEND_URL: "http://127.0.0.1:4100",
      },
    },
  ],
};
