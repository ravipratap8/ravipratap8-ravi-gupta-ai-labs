import { test, expect } from '@playwright/test'

// Voice Copilot UI — uses the typed text fallback (no real microphone needed).
test('voice copilot button appears and routes a typed command', async ({ page }) => {
  await page.goto('/dashboard')
  const button = page.getByRole('button', { name: 'Open Ravi AI Voice Copilot' })
  await expect(button).toBeVisible()
  await button.click()
  const input = page.getByPlaceholder(/command/i)
  await expect(input).toBeVisible()
  await input.fill('open approvals')
  await input.press('Enter')
  await expect(page).toHaveURL(/\/dashboard\/approvals/)
})

test('unknown command shows a safe fallback', async ({ page }) => {
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Open Ravi AI Voice Copilot' }).click()
  const input = page.getByPlaceholder(/command/i)
  await input.fill('xyzzy nonsense command')
  await input.press('Enter')
  await expect(page.getByText(/could not confidently understand/i)).toBeVisible()
})
