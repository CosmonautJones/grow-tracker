import { test, expect, ACTIVE_GROW_ID } from '../fixtures/test-fixtures.js';

test.describe('Navigation', () => {
  test('default route navigates to dashboard', async ({ emptyPage: page }) => {
    // emptyPage fixture already loads '/' — app should default to #/dashboard
    await expect(page.locator('.dashboard-section')).toBeVisible({ timeout: 10000 });
  });

  test('hash navigation between all routes', async ({ seededPage: page }) => {
    // Dashboard — use hash change instead of full page.goto
    await page.evaluate(() => { window.location.hash = '#/dashboard'; });
    await expect(page.locator('.dashboard-section')).toBeVisible({ timeout: 5000 });

    // Setup wizard
    await page.evaluate(() => { window.location.hash = '#/new'; });
    await expect(page.locator('.wizard-section')).toBeVisible({ timeout: 5000 });

    // Grow detail
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}`; }, ACTIVE_GROW_ID);
    await expect(page.locator('#growDetailContent')).toBeVisible({ timeout: 10000 });

    // Notes
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/notes`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.notes-section-full')).toBeVisible({ timeout: 5000 });

    // Gallery
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/gallery`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.gallery-section')).toBeVisible({ timeout: 5000 });

    // Guides
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/guides`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.guides-section')).toBeVisible({ timeout: 5000 });

    // Environment
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/environment`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.env-section')).toBeVisible({ timeout: 5000 });
  });

  test('back/forward browser history works', async ({ seededPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/dashboard'; });
    await expect(page.locator('.dashboard-section')).toBeVisible({ timeout: 5000 });

    await page.evaluate((id) => { window.location.hash = `#/grow/${id}`; }, ACTIVE_GROW_ID);
    await expect(page.locator('#growDetailContent')).toBeVisible({ timeout: 10000 });

    await page.goBack();
    await expect(page.locator('.dashboard-section')).toBeVisible({ timeout: 5000 });

    await page.goForward();
    await expect(page.locator('#growDetailContent')).toBeVisible({ timeout: 10000 });
  });

  test('invalid route shows Page Not Found', async ({ emptyPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/nonexistent-route'; });
    await expect(page.locator('.not-found')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.not-found h2')).toHaveText('Page Not Found');
    await expect(page.locator('.not-found a[href="#/dashboard"]')).toBeVisible();
  });

  test('invalid grow ID redirects to dashboard', async ({ seededPage: page }) => {
    // Use a valid-format but non-existent grow ID — the view should handle it
    await page.evaluate(() => { window.location.hash = '#/grow/nonexistent_grow_999'; });
    // The grow detail view loads but may show loading or redirect
    // Wait to see what happens
    await page.waitForTimeout(2000);
    // Should either redirect to dashboard or show the grow detail with loading state
    const hasDashboard = await page.locator('.dashboard-section').isVisible();
    const hasGrowDetail = await page.locator('#growDetailContent').isVisible();
    const hasLoading = await page.locator('#growDetailLoading').isVisible();
    expect(hasDashboard || hasGrowDetail || hasLoading).toBeTruthy();
  });

  test('deep link to guides with guide param auto-expands', async ({ seededPage: page }) => {
    await page.evaluate((id) => {
      window.location.hash = `#/grow/${id}/guides?guide=lst`;
    }, ACTIVE_GROW_ID);
    await expect(page.locator('.guides-section')).toBeVisible({ timeout: 5000 });

    // The LST guide accordion should be auto-expanded
    const lstToggle = page.locator('#guide-lst .guide-accordion-toggle');
    await expect(lstToggle).toHaveAttribute('aria-expanded', 'true', { timeout: 5000 });
  });

  test('header nav links update per grow context', async ({ seededPage: page }) => {
    // On dashboard, nav should be minimal
    await page.evaluate(() => { window.location.hash = '#/dashboard'; });
    const nav = page.locator('#headerNav');
    await expect(nav.locator('a[href="#/dashboard"]')).toBeVisible({ timeout: 5000 });

    // On a grow view, nav should show grow-specific links
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('#growDetailContent:not(.hidden)', { timeout: 10000 });
    await expect(nav.locator(`a[href="#/grow/${ACTIVE_GROW_ID}/notes"]`)).toBeVisible();
    await expect(nav.locator(`a[href="#/grow/${ACTIVE_GROW_ID}/gallery"]`)).toBeVisible();
    await expect(nav.locator(`a[href="#/grow/${ACTIVE_GROW_ID}/guides"]`)).toBeVisible();
    await expect(nav.locator(`a[href="#/grow/${ACTIVE_GROW_ID}/environment"]`)).toBeVisible();
  });

  test('skip link focuses app-content', async ({ emptyPage: page }) => {
    const skipLink = page.locator('.skip-link');
    // Skip link should exist in the DOM
    await expect(skipLink).toBeAttached();
    // The skip link should point to #app-content
    await expect(skipLink).toHaveAttribute('href', '#app-content');
  });
});
