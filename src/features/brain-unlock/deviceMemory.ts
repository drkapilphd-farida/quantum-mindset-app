"use client";

import type { SessionSets, SetHistory } from "./sets";
import { EMPTY_HISTORY, historyOf, mergeHistory } from "./sets";

// The browser's own memory of Brain Unlock (localStorage): a random device id
// (to match this person's earlier sessions on the server) and the sets
// already seen here — so even a visitor who never left their number does not
// get the same words twice. Private windows / blocked storage: works anyway,
// just without memory.

const DEVICE_KEY = "bu_device";
const SEEN_KEY = "bu_seen";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  // Fallback: RFC 4122 v4 from Math.random (only an anonymous device marker).
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = Math.floor(Math.random() * 16);
    return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function deviceId(): string {
  try {
    const have = window.localStorage.getItem(DEVICE_KEY);
    if (have !== null && /^[0-9a-f-]{36}$/i.test(have)) return have;
    const id = newId();
    window.localStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return newId();
  }
}

export function loadSeen(): SetHistory {
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    if (raw === null) return EMPTY_HISTORY;
    const v = JSON.parse(raw) as Partial<Record<keyof SetHistory, unknown>>;
    const list = (x: unknown): string[] =>
      Array.isArray(x)
        ? x.filter((s): s is string => typeof s === "string").slice(-60)
        : [];
    return {
      check: list(v.check),
      story: list(v.story),
      passages: list(v.passages),
    };
  } catch {
    return EMPTY_HISTORY;
  }
}

export function addSeen(sets: readonly SessionSets[]): void {
  try {
    const next = mergeHistory(loadSeen(), historyOf(sets));
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(next));
  } catch {
    // storage blocked: nothing to remember
  }
}
