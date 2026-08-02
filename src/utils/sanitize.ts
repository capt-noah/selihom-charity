// Client-side sanitization utilities.
// These mirror the server-side checks in server.ts so malformed data
// is rejected before it ever reaches the API.

/** Strip all control characters and trim whitespace. */
export function sanitizeText(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  // Remove ASCII control characters (0x00–0x1F, 0x7F) that can corrupt JSON
  // parsing when embedded in string values, then trim and cap length.
  return value
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLength);
}

/** Sanitize a phone number — keep digits, +, -, spaces, parentheses only. */
export function sanitizePhone(value: string): string {
  return sanitizeText(value, 30).replace(/[^\d+\-\s()]/g, "");
}

/** Very basic email format check (not exhaustive, just sanity). */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Check a string is non-empty after sanitization. */
export function isNonEmpty(value: string): boolean {
  return sanitizeText(value).length > 0;
}

/** Clamp a number to [min, max]. */
export function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

/** Whitelist a value against an allowed set, return fallback if not found. */
export function whitelistValue<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  return (allowed as readonly string[]).includes(value as string)
    ? (value as T)
    : fallback;
}
