import { test, expect } from '@playwright/test'

test.describe('App', () => {
  test('shows the Get started heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Get started' })).toBeVisible()
  })

  test('counter starts at 0 and increments on click', async ({ page }) => {
    await page.goto('/')
    const button = page.getByRole('button', { name: /count is/i })
    await expect(button).toContainText('Count is 0')
    await button.click()
    await expect(button).toContainText('Count is 1')
    await button.click()
    await expect(button).toContainText('Count is 2')
  })

  test('renders Documentation and Connect with us sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Documentation')).toBeVisible()
    await expect(page.getByText('Connect with us')).toBeVisible()
  })

  test('Vite and React external links are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /explore vite/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /learn more/i })).toBeVisible()
  })
})
