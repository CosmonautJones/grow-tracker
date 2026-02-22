import { test, expect, ACTIVE_GROW_ID, COMPLETED_GROW_ID } from '../fixtures/test-fixtures.js';

test.describe('Dashboard', () => {
  test('empty state shows no grows message', async ({ emptyPage: page }) => {
    await expect(page.locator('.empty-state')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=No grows yet')).toBeVisible();
  });

  test('Start New Grow button navigates to wizard', async ({ emptyPage: page }) => {
    await page.click('#newGrowBtn');
    await expect(page.locator('.wizard-section')).toBeVisible({ timeout: 5000 });
  });

  test('active and completed grow cards render with correct data', async ({ seededPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/dashboard'; });
    await page.waitForSelector('.grow-card', { timeout: 10000 });

    // Active grow card
    const activeCard = page.locator(`.grow-card[data-grow-id="${ACTIVE_GROW_ID}"]`);
    await expect(activeCard).toBeVisible();
    await expect(activeCard.locator('.grow-card-name')).toHaveText('Northern Lights Auto');
    await expect(activeCard.locator('.status-active')).toBeVisible();
    await expect(activeCard.locator('.grow-card-details')).toContainText('Week 4/10');
    await expect(activeCard.locator('.grow-card-details')).toContainText('soil');

    // Completed grow card
    const completedCard = page.locator(`.grow-card[data-grow-id="${COMPLETED_GROW_ID}"]`);
    await expect(completedCard).toBeVisible();
    await expect(completedCard.locator('.grow-card-name')).toHaveText('Blue Dream');
    await expect(completedCard.locator('.status-completed')).toBeVisible();
    // Harvest info should show
    await expect(completedCard.locator('.grow-card-harvest')).toContainText('120g');
  });

  test('completed grows section shows when completed grows exist', async ({ seededPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/dashboard'; });
    await page.waitForSelector('.grow-card', { timeout: 10000 });

    const completedSection = page.locator('#completedGrowsSection');
    await expect(completedSection).toBeVisible();
    await expect(completedSection.locator('h3.section-subtitle')).toHaveText('Completed / Archived');
  });

  test('clicking grow card navigates to grow detail', async ({ seededPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/dashboard'; });
    await page.waitForSelector('.grow-card', { timeout: 10000 });

    await page.click(`.grow-card[data-grow-id="${ACTIVE_GROW_ID}"]`);
    await expect(page).toHaveURL(new RegExp(`#/grow/${ACTIVE_GROW_ID}`));
  });

  test('grow cards are keyboard accessible', async ({ seededPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/dashboard'; });
    await page.waitForSelector('.grow-card', { timeout: 10000 });

    const activeCard = page.locator(`.grow-card[data-grow-id="${ACTIVE_GROW_ID}"]`);
    await expect(activeCard).toHaveAttribute('tabindex', '0');
    await expect(activeCard).toHaveAttribute('role', 'link');

    // Focus and press Enter
    await activeCard.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`#/grow/${ACTIVE_GROW_ID}`));
  });

  test('export and import buttons are present', async ({ seededPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/dashboard'; });
    await expect(page.locator('#exportAllBtn')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#importBtn')).toBeVisible();
  });
});
