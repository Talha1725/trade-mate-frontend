module.exports = {
  apps: [
    {
      name: "trade-mate-frontend",
      cwd: __dirname,
      script: "npm",
      args: "run start -- --hostname 0.0.0.0 --port 3100",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        PORT: "3100",
        NEXT_PUBLIC_BACKEND_URL: "http://127.0.0.1:4100",
      },
    },
  ],
};
