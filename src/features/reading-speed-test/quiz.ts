import { randomInt } from 'node:crypto'
import type { TestLang, TestPassage } from './passages'

// Question handling shared by the free tests (server-only): options are
// shuffled per attempt, the shuffle travels in the signed token, and answers
// are checked against the key that never leaves the server.
export type ShownQuestion = { question: string; options: string[] }

export function shuffledOrder(): number[] {
  const order = [0, 1, 2, 3]
  for (let i = order.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[order[i], order[j]] = [order[j]!, order[i]!]
  }
  return order
}

export function showQuestions(passage: TestPassage, perm: number[][]): ShownQuestion[] {
  return passage.questions.map((q, i) => ({ question: q.question, options: perm[i]!.map((original) => q.options[original]!) }))
}

export function countCorrect(passage: TestPassage, perm: number[][], answers: readonly number[]): number {
  return passage.questions.reduce((sum, q, i) => (perm[i]?.[answers[i] ?? -1] === q.correctIndex ? sum + 1 : sum), 0)
}

export function findPassage(pool: readonly TestPassage[], id: string): TestPassage {
  const passage = pool.find((p) => p.id === id)
  if (passage === undefined) throw new Error('unknown passage')
  return passage
}

export function pickPassage(pool: readonly TestPassage[], lang: TestLang, exclude: readonly string[]): TestPassage {
  const inLang = pool.filter((p) => p.lang === lang)
  const fresh = inLang.filter((p) => !exclude.includes(p.id))
  // Every passage seen already: still never repeat the most recent one.
  const candidates = fresh.length > 0 ? fresh : inLang.filter((p) => p.id !== exclude.at(-1))
  return candidates[randomInt(candidates.length)]!
}
