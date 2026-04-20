// In-memory per-username rate limiter for the login form.
// Brief: 5 failed attempts per username per 15 minutes, then 15-minute lockout.

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

type Entry = {
  failures: number;
  firstFailureAt: number;
  lockedUntil: number | null;
};

const entries = new Map<string, Entry>();

function normalise(username: string): string {
  return username.trim().toLowerCase();
}

export function isLocked(username: string, now = Date.now()): boolean {
  const entry = entries.get(normalise(username));
  if (!entry) return false;
  if (entry.lockedUntil && entry.lockedUntil > now) return true;
  return false;
}

export function secondsUntilUnlock(
  username: string,
  now = Date.now(),
): number {
  const entry = entries.get(normalise(username));
  if (!entry?.lockedUntil) return 0;
  return Math.max(0, Math.ceil((entry.lockedUntil - now) / 1000));
}

export function registerFailure(username: string, now = Date.now()): void {
  const key = normalise(username);
  const existing = entries.get(key);

  if (!existing || now - existing.firstFailureAt > WINDOW_MS) {
    entries.set(key, { failures: 1, firstFailureAt: now, lockedUntil: null });
    return;
  }

  const failures = existing.failures + 1;
  const lockedUntil =
    failures >= MAX_FAILURES ? now + LOCKOUT_MS : existing.lockedUntil;
  entries.set(key, {
    failures,
    firstFailureAt: existing.firstFailureAt,
    lockedUntil,
  });
}

export function clear(username: string): void {
  entries.delete(normalise(username));
}

export function _resetForTests(): void {
  entries.clear();
}
