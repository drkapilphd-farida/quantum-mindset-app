type CurriculumWatermarkOverlayProps = {
  text: string
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

// A tiled SVG background image, not hundreds of real DOM text nodes —
// the standard technique for a performant repeating watermark (Google
// Docs/Zoom use the same approach). Regenerated only when `text`
// changes (a stable per-viewer string for the lifetime of the page), so
// this never re-renders per frame.
function buildWatermarkTileDataUri(text: string): string {
  const safeText = escapeXml(text)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="260"><text x="220" y="140" transform="rotate(-30 220 140)" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(120,120,120,0.3)">${safeText}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// Anti-Leak Watermark™ (see getCurriculumWatermarkText.ts's own doc
// comment for what this does and doesn't achieve — a deterrent via
// traceability, never real prevention, which no website can offer).
// Fixed positioning + a z-index above every other layer this feature
// renders (DayMasterPlayer's own immersive `fixed inset-0 z-50` player,
// MasterclassPaywallModal's dialog) so one single mount here, at the top
// of ThirtyDayCurriculumExperience, stays visible through the Overview,
// Day Detail, the in-page wizard, and the assessment canvas alike —
// never needs re-adding inside any of those individually.
// pointer-events-none: purely visual, never intercepts a real tap or
// click underneath it.
export function CurriculumWatermarkOverlay({ text }: CurriculumWatermarkOverlayProps): React.JSX.Element {
  const tileUrl = buildWatermarkTileDataUri(text)
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70]"
      style={{ backgroundImage: `url("${tileUrl}")`, backgroundRepeat: 'repeat' }}
    />
  )
}
