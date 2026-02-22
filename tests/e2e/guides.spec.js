import { test, expect, ACTIVE_GROW_ID } from '../fixtures/test-fixtures.js';

test.describe('Guides', () => {
  test('all guides render as accordions', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/guides`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.guide-card', { timeout: 10000 });

    const guideCards = page.locator('.guide-card');
    expect(await guideCards.count()).toBeGreaterThanOrEqual(5);

    // Each should have an accordion toggle
    const toggles = page.locator('.guide-accordion-toggle');
    expect(await toggles.count()).toBe(await guideCards.count());
  });

  test('expand and collapse guides with aria-expanded', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/guides`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.guide-card', { timeout: 10000 });

    const firstToggle = page.locator('.guide-accordion-toggle').first();

    // Initially collapsed
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');

    // Click to expand
    await firstToggle.click();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'true');

    // The body should be visible
    const bodyId = await firstToggle.getAttribute('aria-controls');
    await expect(page.locator(`#${bodyId}`)).not.toHaveClass(/hidden/);

    // Click again to collapse
    await firstToggle.click();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(`#${bodyId}`)).toHaveClass(/hidden/);
  });

  test('table sections render with correct structure', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/guides`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.guide-card', { timeout: 10000 });

    // Expand the deficiencies guide (which has a table section)
    const deficienciesToggle = page.locator('#guide-deficiencies .guide-accordion-toggle');
    await deficienciesToggle.click();
    await expect(deficienciesToggle).toHaveAttribute('aria-expanded', 'true');

    // Find the table section
    const table = page.locator('#guide-body-deficiencies .guide-table');
    await expect(table).toBeVisible();

    // Should have thead and tbody
    await expect(table.locator('thead')).toBeVisible();
    await expect(table.locator('tbody')).toBeVisible();

    // Check column headers
    const headers = table.locator('thead th');
    expect(await headers.count()).toBe(4);
    await expect(headers.nth(0)).toHaveText('Deficiency');
    await expect(headers.nth(1)).toHaveText('Affects');
    await expect(headers.nth(2)).toHaveText('Key Symptom');
    await expect(headers.nth(3)).toHaveText('Common Fix');

    // Check rows
    const rows = table.locator('tbody tr');
    expect(await rows.count()).toBe(9);
  });

  test('pH-range visual renders with bars and axis', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/guides`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.guide-card', { timeout: 10000 });

    // Expand the deficiencies guide (has ph-range section)
    const deficienciesToggle = page.locator('#guide-deficiencies .guide-accordion-toggle');
    await deficienciesToggle.click();

    // Find the pH range visual
    const phVisual = page.locator('#guide-body-deficiencies .ph-range-visual');
    await expect(phVisual).toBeVisible();

    // Should have range rows
    const rows = phVisual.locator('.ph-range-row');
    expect(await rows.count()).toBe(5);

    // Each row should have a label, bar track, and values
    const firstRow = rows.first();
    await expect(firstRow.locator('.ph-range-label')).toBeVisible();
    await expect(firstRow.locator('.ph-range-bar-track')).toBeVisible();
    await expect(firstRow.locator('.ph-range-bar-fill')).toBeVisible();
    await expect(firstRow.locator('.ph-range-values')).toBeVisible();

    // Check bar fill has style attributes for positioning
    const soilBar = firstRow.locator('.ph-range-bar-fill');
    const style = await soilBar.getAttribute('style');
    expect(style).toContain('left:');
    expect(style).toContain('width:');

    // Axis labels
    const axis = phVisual.locator('.ph-range-axis');
    await expect(axis).toBeVisible();
    const axisLabels = axis.locator('span');
    expect(await axisLabels.count()).toBe(8);
    await expect(axisLabels.first()).toHaveText('4.5');
    await expect(axisLabels.last()).toHaveText('8');
  });

  test('deep link via guide param auto-expands specific guide', async ({ seededPage: page }) => {
    await page.evaluate((id) => {
      window.location.hash = `#/grow/${id}/guides?guide=lst`;
    }, ACTIVE_GROW_ID);
    await page.waitForSelector('.guide-card', { timeout: 10000 });

    const lstToggle = page.locator('#guide-lst .guide-accordion-toggle');
    await expect(lstToggle).toHaveAttribute('aria-expanded', 'true', { timeout: 5000 });

    // Other guides should remain collapsed
    const toxToggle = page.locator('#guide-toxicities .guide-accordion-toggle');
    await expect(toxToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('new guides (toxicities, pests) appear', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/guides`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.guide-card', { timeout: 10000 });

    await expect(page.locator('#guide-toxicities')).toBeVisible();
    await expect(page.locator('#guide-pests')).toBeVisible();
    await expect(page.locator('#guide-drying-curing')).toBeVisible();
  });

  test('toxicities guide has table section', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/guides`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.guide-card', { timeout: 10000 });

    // Expand toxicities
    const toxToggle = page.locator('#guide-toxicities .guide-accordion-toggle');
    await toxToggle.click();

    // Should have a quick reference table
    const table = page.locator('#guide-body-toxicities .guide-table');
    await expect(table).toBeVisible();

    const headers = table.locator('thead th');
    await expect(headers.nth(0)).toHaveText('Issue');
    await expect(headers.nth(1)).toHaveText('Key Indicator');
    await expect(headers.nth(2)).toHaveText('First Step');
  });

  test('guide cards show week range info', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/guides`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.guide-card', { timeout: 10000 });

    // LST guide should show week range for autoflower
    const lstCard = page.locator('#guide-lst');
    await expect(lstCard.locator('.guide-week-range')).toContainText('Best during weeks');
  });
});
