import { contact } from './site.config'

// Every "see all videos" link points to the official YouTube channel.
// The old Quantum Speed Reading success-stories playlist is retired and
// must not be linked (reviewsPlaylist.test.ts guards this).
//
// Embeds use youtube-nocookie.com, YouTube's own privacy-enhanced embed
// domain — the only one the frame-src allowance in next.config.ts permits.
export const YOUTUBE_CHANNEL_URL = contact.youtube.url
