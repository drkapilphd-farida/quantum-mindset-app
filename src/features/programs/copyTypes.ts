import type { Program } from './types'

/** The part of a program page that comes from the approved copy document. */
export type ProgramCopy = Pick<Program, 'h1' | 'subline' | 'soundLike' | 'why' | 'changes' | 'faqs' | 'related' | 'disclaimers'>
