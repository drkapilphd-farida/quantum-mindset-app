import { test, expect, type Page } from '@playwright/test'
import { RSVP_PASSAGES } from '../../src/features/brain-unlock/v3/content'

// Brain Test v3 (?v=3) played end to end on a phone-sized screen. Server
// actions (progress, lead, events) are blocked so the run writes nothing to
// the database; the page must still reach the result screen.
test.use({ storageState: { cookies: [], origins: [] }, viewport: { width: 360, height: 780 }, hasTouch: true, isMobile: true })

async function blockServerActions(page: Page): Promise<void> {
  await page.route('**/*', async (route) => {
    const req = route.request()
    if (req.method() === 'POST' && (await req.headerValue('next-action')) !== null) return route.abort()
    return route.continue()
  })
}

async function playGrid(page: Page): Promise<void> {
  await expect(page.locator('[data-v3-grid]')).toBeVisible()
  // 4 × 4: the numbers 1–16, nothing more.
  await expect(page.locator('[data-v3-cell]')).toHaveCount(16)
  for (let n = 1; n <= 16; n++) await page.locator(`[data-v3-cell="${n}"]`).dispatchEvent('pointerdown')
}

test('v3 plays from round 1 to the Brain Score with one WhatsApp button', async ({ page }) => {
  test.setTimeout(120_000)
  await blockServerActions(page)
  await page.goto('/reading-memory-test?v=3&lang=en')
  await expect(page.locator('[data-bu-v="3"]')).toBeVisible()
  await expect(page.getByText('Round 1 of 4')).toBeVisible()
  await expect(page.locator('footer, nav')).toHaveCount(0)

  // Round 1: 1 → 16.
  await expect(page.getByText('Tap 1 to 16 as fast as you can')).toBeVisible()
  await playGrid(page)
  await expect(page.locator('[data-v3-flash]')).toContainText(/Focus: \d+\.\d sec/)
  // Score screens never move on by themselves.
  await page.waitForTimeout(5_000)
  await expect(page.locator('[data-v3-flash]')).toBeVisible()
  await page.locator('[data-v3-flash-next]').click()

  // Name screen: choosing who is playing is required, the name is not.
  await page.locator('[data-v3-name-continue]').click()
  await expect(page.getByText('Please choose who is playing.')).toBeVisible()
  await page.locator('[data-v3-first-name]').fill('Riya')
  await page.locator('[data-v3-player="child"]').click()
  await page.locator('[data-v3-name-continue]').click()

  // One intro screen, then 3 breaths (skipped here to keep the test short), then round 2.
  await expect(page.locator('[data-v3-breath-intro]')).toContainText('Now take 3 slow breaths')
  await page.locator('[data-v3-breath-start]').click()
  await expect(page.locator('[data-v3-breath]')).toBeVisible()
  await page.locator('[data-v3-breath-skip]').click()
  await expect(page.getByText('Round 2 of 4')).toBeVisible()
  await playGrid(page)
  // The round 2 screen (focus faster / compare) also waits for Continue.
  await page.waitForTimeout(5_000)
  await expect(page.locator('[data-v3-flash]')).toBeVisible()
  await page.locator('[data-v3-flash-next]').click()

  // Round 3: remember the 7, then pick exactly those.
  await expect(page.locator('[data-v3-memory="show"]')).toBeVisible()
  const shown = await page.locator('[data-v3-shown]').evaluateAll((els) => els.map((e) => e.getAttribute('data-v3-shown') ?? ''))
  expect(shown).toHaveLength(7)
  await expect(page.locator('[data-v3-memory="pick"]')).toBeVisible({ timeout: 20_000 })
  await expect(page.locator('[data-v3-option]')).toHaveCount(12)
  for (const id of shown) await page.locator(`[data-v3-option="${id}"]`).click()
  await page.locator('[data-v3-memory-done]').click()
  await expect(page.locator('[data-v3-flash]')).toContainText('Memory: 7/7')
  await page.locator('[data-v3-flash-next]').click()

  // Round 4: RSVP at 350 WPM, then the one question — answered right.
  await page.locator('[data-v3-rsvp-start]').click()
  const question = page.locator('[data-v3-rsvp="question"]')
  await expect(question).toBeVisible({ timeout: 30_000 })
  const passageId = await question.getAttribute('data-v3-passage')
  const passage = RSVP_PASSAGES.find((p) => p.id === passageId)
  expect(passage).toBeDefined()
  await page.locator(`[data-v3-rsvp-option="${passage!.question.en.answer}"]`).click()
  await expect(page.getByText('You read at 350 words per minute — and understood it ✓')).toBeVisible()
  await page.locator('[data-v3-flash-next]').click()

  // Result: score, 4 bars, exactly one button, no price.
  const result = page.locator('[data-v3-result]')
  await expect(result).toBeVisible()
  const score = Number(await result.getAttribute('data-v3-score'))
  expect(score).toBeGreaterThanOrEqual(0)
  expect(score).toBeLessThanOrEqual(100)
  await expect(page.locator('[data-v3-bar]')).toHaveCount(4)
  // Very fast grids (focus 25/25) and 7/7 memory: the two are balanced; Reading is never named.
  await expect(result).toContainText('Focus and Memory are balanced.')
  await expect(result).not.toContainText('room to grow: Reading')
  await expect(result.locator('button, a')).toHaveCount(1)
  await expect(page.locator('[data-v3-send]')).toHaveText(/Send my report on WhatsApp/)
  await expect(page.locator('body')).not.toContainText('₹')
})

test('without ?v=3 the page is still Brain Test v2', async ({ page }) => {
  await blockServerActions(page)
  await page.goto('/reading-memory-test?lang=en')
  await expect(page.locator('[data-bu-v="2"]')).toBeVisible()
  await expect(page.locator('[data-bu-v="3"]')).toHaveCount(0)
})
