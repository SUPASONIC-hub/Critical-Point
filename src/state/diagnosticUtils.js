export function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
