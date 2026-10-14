import type { Metadata } from 'next'
import SharpBrainNav from '@/components/sharp-brain/SharpBrainNav'
import Footer from '@/components/Footer'
import ReadingMemoryTest from '@/features/reading-memory-test/components/ReadingMemoryTest'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  path: '/reading-memory-test',
  title: 'Free Reading & Memory Test — How much do you remember after you read? | Mind Ur Mind',
  description:
    'A free 3-minute test: read a short passage, remember 8 pictures, then answer 4 questions from memory. Get your effective reading speed, memory and retention — your personal Brain Profile. English or Hindi.',
})

// The Free Reading & Memory Test (replaced the Reading Speed Test, Oct 2026).
// Old links (/test, /programs/sharp-brain/speed-test, ?mode=live) forward
// here with their utm_* tags.
export default function ReadingMemoryTestPage(): React.JSX.Element {
  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <SharpBrainNav />
      <main>
        <ReadingMemoryTest />
      </main>
      <Footer />
    </div>
  )
}
