import { test, expect, ACTIVE_GROW_ID } from '../fixtures/test-fixtures.js';

test.describe('Gallery', () => {
  test('gallery renders with empty state', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/gallery`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.gallery-section')).toBeVisible({ timeout: 5000 });

    // Should show empty state since we have no photos in seed data
    const photoGrid = page.locator('#photoGrid');
    await expect(photoGrid).toBeVisible();
  });

  test('gallery filters render', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/gallery`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.gallery-section')).toBeVisible({ timeout: 5000 });

    await expect(page.locator('#galleryFilterCategory')).toBeVisible();
    await expect(page.locator('#galleryFilterWeek')).toBeVisible();

    // Category filter should have options
    const options = page.locator('#galleryFilterCategory option');
    expect(await options.count()).toBeGreaterThan(1);
  });

  test('upload area is present', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/gallery`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.gallery-section')).toBeVisible({ timeout: 5000 });

    // Upload area should exist
    await expect(page.locator('#uploadArea')).toBeVisible();
  });
});
