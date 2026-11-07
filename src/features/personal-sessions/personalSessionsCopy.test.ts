import { describe, expect, it } from 'vitest'
import { personalSessionsCopy } from './personalSessionsCopy'

const allText = JSON.stringify(personalSessionsCopy).toLowerCase()

describe('Personal Sessions copy (owner rules, Nov 2026)', () => {
  it('makes no medical claims or promises', () => {
    for (const word of ['cure', 'treat', 'heal', 'guarantee', 'diagnos', 'medicine']) {
      expect(allText).not.toContain(word)
    }
  })

  it('has the three groups, with every topic the owner listed', () => {
    const topics = personalSessionsCopy.groups.items.flatMap((g) => g.topics.map((t) => t.name.toLowerCase()))
    for (const topic of ['stress', 'anxiety and panic', 'mindset coaching', 'subconscious reprogramming', 'intuition training for traders', 'heart-brain coherence for fear', 'aura reading', 'chakra activation', 'samadhi meditation', 'kundalini meditation', 'astral projection']) {
      expect(topics).toContain(topic)
    }
    expect(personalSessionsCopy.groups.items.find((g) => g.id === 'spiritual')?.badge).toBe('1-on-1 only')
  })

  it('asks the owner’s enquiry question word for word', () => {
    expect(personalSessionsCopy.enquiry.change).toBe('What would you like to change in your life, and why?')
  })

  it('uses the words support and coaching', () => {
    expect(allText).toContain('support')
    expect(allText).toContain('coaching')
  })
})
