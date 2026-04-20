import { beforeEach, describe, expect, it } from "vitest";

import {
  _resetForTests,
  clear,
  isLocked,
  registerFailure,
  secondsUntilUnlock,
} from "./rate-limit.server";

describe("login rate limiter", () => {
  beforeEach(() => {
    _resetForTests();
  });

  it("allows up to 4 failures without locking", () => {
    for (let i = 0; i < 4; i++) registerFailure("ana.g");
    expect(isLocked("ana.g")).toBe(false);
  });

  it("locks on the 5th failure", () => {
    for (let i = 0; i < 5; i++) registerFailure("ana.g");
    expect(isLocked("ana.g")).toBe(true);
    expect(secondsUntilUnlock("ana.g")).toBeGreaterThan(0);
  });

  it("is case-insensitive on username", () => {
    for (let i = 0; i < 5; i++) registerFailure("Ana.G");
    expect(isLocked("ana.g")).toBe(true);
    expect(isLocked("ANA.G")).toBe(true);
  });

  it("isolates different usernames", () => {
    for (let i = 0; i < 5; i++) registerFailure("ana.g");
    expect(isLocked("ana.g")).toBe(true);
    expect(isLocked("luis.r")).toBe(false);
  });

  it("clear() unlocks a user", () => {
    for (let i = 0; i < 5; i++) registerFailure("ana.g");
    expect(isLocked("ana.g")).toBe(true);
    clear("ana.g");
    expect(isLocked("ana.g")).toBe(false);
  });

  it("unlocks after the lockout window elapses", () => {
    const base = 1_000_000_000;
    for (let i = 0; i < 5; i++) registerFailure("ana.g", base);
    expect(isLocked("ana.g", base)).toBe(true);
    const SIXTEEN_MIN = 16 * 60 * 1000;
    expect(isLocked("ana.g", base + SIXTEEN_MIN)).toBe(false);
  });
});
