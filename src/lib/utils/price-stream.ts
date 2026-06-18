function getBackendBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_BACKEND_URL?.trim().replace(/\/$/, "");

  if (configured) {
    return configured;
  }

  return "http://localhost:4000";
}

export function getPriceSocketUrl() {
  const backend = new URL(getBackendBaseUrl());
  backend.protocol = backend.protocol === "https:" ? "wss:" : "ws:";
  backend.pathname = "/ws/prices";
  backend.search = "";
  backend.hash = "";
  return backend.toString();
}
