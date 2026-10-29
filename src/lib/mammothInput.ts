/**
 * The input object for mammoth. mammoth reads `arrayBuffer` only in its
 * browser build; on the server (Node) it needs a `buffer` — given an
 * arrayBuffer it throws "Could not find file in options", which made every
 * Word (.docx) upload fail when read server-side.
 */
export function mammothInput(arrayBuffer: ArrayBuffer): { buffer: Buffer } | { arrayBuffer: ArrayBuffer } {
  return typeof window === 'undefined' && typeof Buffer !== 'undefined' ? { buffer: Buffer.from(arrayBuffer) } : { arrayBuffer }
}
