export const TELEMETRY_QUEUE_MAX_ITEMS = 50;
export const TELEMETRY_QUEUE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function pruneTelemetryQueue(items, now = Date.now()) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => {
      const queuedAt = Date.parse(item?.queuedAt ?? "");
      return !Number.isFinite(queuedAt) || now - queuedAt <= TELEMETRY_QUEUE_TTL_MS;
    })
    .slice(-TELEMETRY_QUEUE_MAX_ITEMS);
}
