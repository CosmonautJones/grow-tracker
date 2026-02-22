import { test, expect } from '../fixtures/test-fixtures.js';

test.describe('Theme', () => {
  test('theme toggle switches between light and dark', async ({ emptyPage: page }) => {
    const toggleBtn = page.locator('#themeToggle');
    await expect(toggleBtn).toBeVisible();

    // Get initial theme
    const initialTheme = await page.locator('html').getAttribute('data-theme');

    // Click toggle
    await toggleBtn.click();

    const newTheme = await page.locator('html').getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);

    // Click toggle again — should go back
    await toggleBtn.click();
    const restoredTheme = await page.locator('html').getAttribute('data-theme');
    expect(restoredTheme).toBe(initialTheme);
  });

  test('dark mode sets data-theme="dark" on html', async ({ emptyPage: page }) => {
    const toggleBtn = page.locator('#themeToggle');

    // Determine current theme and switch to dark if needed
    const currentTheme = await page.locator('html').getAttribute('data-theme');
    if (currentTheme !== 'dark') {
      await toggleBtn.click();
    }

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('theme persists across reload via localStorage', async ({ emptyPage: page }) => {
    // Set dark theme
    await page.evaluate(() => localStorage.setItem('gt_theme', 'dark'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#app-content', { state: 'attached' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Set light theme
    await page.evaluate(() => localStorage.setItem('gt_theme', 'light'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#app-content', { state: 'attached' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('theme toggle button has correct aria-label', async ({ emptyPage: page }) => {
    const toggleBtn = page.locator('#themeToggle');
    await expect(toggleBtn).toHaveAttribute('aria-label', 'Toggle dark mode');
  });

  test('key elements are styled in dark mode', async ({ emptyPage: page }) => {
    await page.evaluate(() => localStorage.setItem('gt_theme', 'dark'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#app-content', { state: 'attached' });

    // Header should be visible and styled
    await expect(page.locator('.app-header')).toBeVisible();

    // Dashboard section should be visible
    await expect(page.locator('.dashboard-section')).toBeVisible({ timeout: 10000 });

    // Body background should differ from light mode default
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    // Dark mode should have a dark background (not white)
    expect(bgColor).not.toBe('rgb(255, 255, 255)');
  });
});
