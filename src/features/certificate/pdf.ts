// A one-page PDF holding one JPEG, filling an A4 landscape page. The
// certificate is drawn on a canvas in the browser (which shapes all 8 scripts
// correctly), so the PDF only needs to carry that picture — no PDF library.

const A4_LANDSCAPE = { width: 841.89, height: 595.28 } // points

export function jpegToPdf(jpeg: Uint8Array, pixelWidth: number, pixelHeight: number, title: string): Uint8Array<ArrayBuffer> {
  const enc = new TextEncoder()
  const { width: pw, height: ph } = A4_LANDSCAPE
  // Fit the image to the page, keeping its shape, centred.
  const scale = Math.min(pw / pixelWidth, ph / pixelHeight)
  const w = +(pixelWidth * scale).toFixed(2)
  const h = +(pixelHeight * scale).toFixed(2)
  const x = +((pw - w) / 2).toFixed(2)
  const y = +((ph - h) / 2).toFixed(2)
  const content = `q ${w} 0 0 ${h} ${x} ${y} cm /Im0 Do Q`
  // PDF text strings: keep the title to printable ASCII, escaped.
  const safeTitle = title.replace(/[^\x20-\x7E]/g, '').replace(/([\\()])/g, '\\$1')

  const parts: Uint8Array[] = []
  const offsets: number[] = []
  let length = 0
  const push = (chunk: Uint8Array | string): void => {
    const bytes = typeof chunk === 'string' ? enc.encode(chunk) : chunk
    parts.push(bytes)
    length += bytes.length
  }
  const object = (n: number, body: string): void => {
    offsets[n] = length
    push(`${n} 0 obj\n${body}\nendobj\n`)
  }

  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')
  object(1, '<< /Type /Catalog /Pages 2 0 R >>')
  object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>')
  object(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`)
  offsets[4] = length
  push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${pixelWidth} /Height ${pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`)
  push(jpeg)
  push('\nendstream\nendobj\n')
  object(5, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
  object(6, `<< /Title (${safeTitle}) /Producer (Mind Ur Mind) >>`)

  const xref = length
  const rows = offsets.slice(1).map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')
  push(`xref\n0 ${offsets.length}\n0000000000 65535 f \n${rows}`)
  push(`trailer\n<< /Size ${offsets.length} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF\n`)

  const out = new Uint8Array(length)
  let at = 0
  for (const part of parts) {
    out.set(part, at)
    at += part.length
  }
  return out
}
