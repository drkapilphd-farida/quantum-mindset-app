import { permanentRedirect } from 'next/navigation'

// The old personal Reading Speed Test offer page (₹1,000 off for 48 hours).
// Offers don't stack on the parents price (4 Nov 2026), so every old offer
// link opens the program page's checkout.
export default function SharpBrainOfferPage(): never {
  permanentRedirect('/programs/sharp-brain#enrol')
}
