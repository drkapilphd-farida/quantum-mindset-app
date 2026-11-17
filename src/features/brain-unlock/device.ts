// Device type for every Brain Unlock visit (founder, 17 Nov 2026). Pure — tested.
// From the browser's user agent; an iPad that reports itself as a Mac is
// caught by its touch points. No fingerprinting, no personal data.
export type DeviceType = "mobile" | "tablet" | "desktop";

export function deviceType(userAgent: string, maxTouchPoints = 0): DeviceType {
  const ua = userAgent;
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return "tablet";
  if (/Macintosh/i.test(ua) && maxTouchPoints > 1) return "tablet";
  if (/Mobi|iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile|webOS/i.test(ua)) return "mobile";
  return "desktop";
}

/** In the browser only; "desktop" on the server. */
export function currentDevice(): DeviceType {
  if (typeof navigator === "undefined") return "desktop";
  return deviceType(navigator.userAgent, navigator.maxTouchPoints ?? 0);
}
