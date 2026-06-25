import { test, expect } from '@playwright/test'

test('homepage shows Ravi Gupta hero', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Ravi Gupta', level: 1 })).toBeVisible()
})

test('can open dashboard', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.getByText('Total events')).toBeVisible()
})
