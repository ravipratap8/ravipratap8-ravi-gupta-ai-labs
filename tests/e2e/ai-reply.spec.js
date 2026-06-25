import { test, expect } from '@playwright/test'

test('AI inbox renders conversations', async ({ page }) => {
  await page.goto('/dashboard/inbox')
  await expect(page.getByText('conversations')).toBeVisible()
})
