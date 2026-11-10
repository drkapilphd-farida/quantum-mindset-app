// Owner (Nov 2026): after a lead form is saved, WhatsApp opens with all the
// answers typed in, so the person only taps Send.
//
// Phones only allow a new tab during the tap itself, so the tab is opened
// (blank) at submit time and pointed at wa.me once the lead is saved. If the
// browser blocked the tab, the current tab goes to WhatsApp instead.

/** Call synchronously inside the submit handler, before any await. */
export function openPendingWhatsAppTab(): Window | null {
  try {
    return window.open('about:blank', '_blank');
  } catch {
    return null;
  }
}

/** The lead is saved: send the pending tab (or this tab) to WhatsApp. */
export function finishWhatsAppHandoff(tab: Window | null, url: string): void {
  if (tab !== null && !tab.closed) {
    tab.location.href = url;
    return;
  }
  window.location.assign(url);
}

/** Saving failed: close the blank tab again. */
export function cancelWhatsAppHandoff(tab: Window | null): void {
  if (tab !== null && !tab.closed) tab.close();
}
