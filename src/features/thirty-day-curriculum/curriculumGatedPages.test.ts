import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CURRICULUM_GATED_EXERCISE_IDS } from './curriculumGatedExercises'

// Every curriculum-only exercise must check paid access on the server, so
// it can't be opened by typing its URL (six pages previously could).
describe('curriculum-only exercise pages', () => {
  it.each([...CURRICULUM_GATED_EXERCISE_IDS])('%s checks paid access on the server', (id) => {
    const file = join(process.cwd(), 'src/app/labs/sharp-brain', id, 'page.tsx')
    expect(existsSync(file)).toBe(true)
    expect(readFileSync(file, 'utf8')).toMatch(/hasQuantumSpeedReadingProAccess\(\)/)
  })

  it('the curriculum page itself refuses a closed day opened by URL on the server', () => {
    const page = readFileSync(join(process.cwd(), 'src/app/(dashboard)/labs/sharp-brain/thirty-day-curriculum/page.tsx'), 'utf8')
    expect(page).toMatch(/isCurriculumDayUnlocked\(requestedDay/)
    expect(page).toMatch(/redirect\(/)
  })
})
