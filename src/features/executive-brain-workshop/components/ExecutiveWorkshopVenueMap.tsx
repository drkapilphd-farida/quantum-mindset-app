import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'

// No Google Maps API key needed for either the embed or the directions
// link — both use Google's plain public search-query URL forms.
export function ExecutiveWorkshopVenueMap(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig
  const encodedQuery = encodeURIComponent(config.venueMapsSearchQuery)

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
      <iframe
        title={`Map showing ${config.venueName}`}
        src={`https://www.google.com/maps?q=${encodedQuery}&output=embed`}
        width="100%"
        height="280"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full"
      />
      <div className="flex flex-col gap-2 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[14.5px] font-semibold text-slate-900">{config.venueName}</p>
          <p className="text-[13px] text-slate-500">{config.venueAddress}</p>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodedQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-none items-center justify-center rounded-sm border border-slate-300 px-4 py-2 text-[13.5px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Get directions →
        </a>
      </div>
    </div>
  )
}
