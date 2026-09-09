const inFlightRequests = new Map<string, Promise<unknown>>();

export function dedupeInFlight<T>(key: string, request: () => Promise<T>): Promise<T> {
  const existing = inFlightRequests.get(key);

  if (existing) {
    return existing as Promise<T>;
  }

  const promise = request().finally(() => {
    inFlightRequests.delete(key);
  });

  inFlightRequests.set(key, promise);
  return promise;
}
