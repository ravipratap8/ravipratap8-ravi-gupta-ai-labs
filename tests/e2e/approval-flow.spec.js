import { test, expect } from '@playwright/test'

test('approvals page shows human-in-the-loop review', async ({ page }) => {
  await page.goto('/dashboard/approvals')
  await expect(page.getByText('Admin Approval Mode')).toBeVisible()
})
