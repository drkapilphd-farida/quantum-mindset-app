import { Mukta } from 'next/font/google'

// Owner's design brief (Nov 2026): Mukta 400/600/800 on the hub and the 15
// program pages only (it also covers Devanagari). Header and footer keep
// the site font — the class goes on <main>, not on the page wrapper.
export const mukta = Mukta({ subsets: ['latin', 'devanagari'], weight: ['400', '600', '800'], display: 'swap' })
