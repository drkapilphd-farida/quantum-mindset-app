// The order questions are asked in, where a missed item comes back once at
// the end of the round. Scoring counts first tries only. Pure logic.
export type RetryQueue = { order: number[]; pos: number; firstTry: boolean[]; correctFirst: number; retried: Set<number> }

export function startQueue(order: readonly number[]): RetryQueue {
  return { order: [...order], pos: 0, firstTry: [], correctFirst: 0, retried: new Set() }
}

export function current(q: RetryQueue): number | null {
  return q.pos < q.order.length ? q.order[q.pos]! : null
}

/** True when the current question is a second try (its result doesn't count). */
export function isRetry(q: RetryQueue): boolean {
  const item = current(q)
  return item !== null && q.order.indexOf(item) < q.pos
}

/** Record an answer and move on; a first-try miss is asked again at the end. */
export function answer(q: RetryQueue, correct: boolean): RetryQueue {
  const item = current(q)
  if (item === null) return q
  const retry = isRetry(q)
  const next: RetryQueue = { ...q, pos: q.pos + 1, order: [...q.order], retried: new Set(q.retried) }
  if (!retry && correct) next.correctFirst = q.correctFirst + 1
  if (!retry && !correct && !q.retried.has(item)) {
    next.order.push(item)
    next.retried.add(item)
  }
  return next
}

export function finished(q: RetryQueue): boolean {
  return q.pos >= q.order.length
}

/** Whether a wrong answer to the current question will be asked again. */
export function willComeBack(q: RetryQueue): boolean {
  const item = current(q)
  return item !== null && !isRetry(q) && !q.retried.has(item)
}
