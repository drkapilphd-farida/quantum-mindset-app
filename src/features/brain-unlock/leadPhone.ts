import { normalizeIndianMobile } from "@/lib/phone/indianMobile";

// The report form's WhatsApp number, as the leads table stores it: digits with
// the country code ("91…"). An Indian mobile in any common format, or a
// foreign number written with "+". Shared by the browser (friendly check on
// tap) and the server (the real check). Pure — tested in actions.test.ts.
export function leadPhoneDigits(raw: string): string | null {
  const indian = normalizeIndianMobile(raw);
  if (indian !== null) return indian.slice(1);
  const digits = raw.replace(/\D/g, "");
  return /^[0-9]{10,15}$/.test(digits) &&
    !raw.trim().startsWith("0") &&
    raw.trim().startsWith("+")
    ? digits
    : null;
}
