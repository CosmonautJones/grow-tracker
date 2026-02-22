import { test, expect, ACTIVE_GROW_ID } from '../fixtures/test-fixtures.js';

test.describe('Accessibility', () => {
  test('skip link exists and has correct target', async ({ emptyPage: page }) => {
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveAttribute('href', '#app-content');
  });

  test('accordion buttons have aria-expanded and aria-controls', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/guides`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.guide-card', { timeout: 10000 });

    const toggles = page.locator('.guide-accordion-toggle');
    const count = await toggles.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const toggle = toggles.nth(i);
      await expect(toggle).toHaveAttribute('aria-expanded');
      const ariaControls = await toggle.getAttribute('aria-controls');
      expect(ariaControls).toBeTruthy();

      // The controlled element should exist
      await expect(page.locator(`#${ariaControls}`)).toBeAttached();
    }
  });

  test('form inputs have associated labels', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/environment`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.env-section')).toBeVisible({ timeout: 5000 });

    // Check that labeled inputs have associated labels
    const labeledInputs = ['#envTemp', '#envHumidity', '#envCo2', '#envWeek'];
    for (const selector of labeledInputs) {
      const input = page.locator(selector);
      if (await input.isVisible()) {
        // Input should be within a label or have an associated label
        const inputGroup = input.locator('..');
        const label = inputGroup.locator('label');
        await expect(label).toBeAttached();
      }
    }
  });

  test('toast container has role="status"', async ({ emptyPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/new'; });
    await expect(page.locator('.wizard-section')).toBeVisible({ timeout: 5000 });

    // Navigate to step 2 and try to proceed without strain name to trigger a toast
    await page.click('#wizardNext'); // go to step 2
    await page.click('#wizardNext'); // try to proceed without filling

    // The toast container should appear with role="status"
    const toastContainer = page.locator('#toast-container');
    if (await toastContainer.isVisible()) {
      await expect(toastContainer).toHaveAttribute('role', 'status');
    }
  });

  test('table headers use th elements', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/guides`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.guide-card', { timeout: 10000 });

    // Expand deficiencies guide to access table
    await page.click('#guide-deficiencies .guide-accordion-toggle');

    const table = page.locator('#guide-body-deficiencies .guide-table');
    await expect(table).toBeVisible();

    // Headers should use <th> elements
    const ths = table.locator('thead th');
    expect(await ths.count()).toBeGreaterThan(0);

    // Data cells should use <td> elements
    const tds = table.locator('tbody td');
    expect(await tds.count()).toBeGreaterThan(0);
  });

  test('app-content has role="main"', async ({ emptyPage: page }) => {
    const appContent = page.locator('#app-content');
    await expect(appContent).toHaveAttribute('role', 'main');
  });

  test('note modal has proper ARIA attributes', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/notes`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.notes-section-full', { timeout: 10000 });

    const modal = page.locator('#noteModal');
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal).toHaveAttribute('aria-labelledby', 'noteModalTitle');
  });

  test('grow cards have role="link" for keyboard navigation', async ({ seededPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/dashboard'; });
    await page.waitForSelector('.grow-card', { timeout: 10000 });

    const cards = page.locator('.grow-card');
    for (let i = 0; i < await cards.count(); i++) {
      await expect(cards.nth(i)).toHaveAttribute('role', 'link');
      await expect(cards.nth(i)).toHaveAttribute('tabindex', '0');
    }
  });

  test('theme toggle has aria-label', async ({ emptyPage: page }) => {
    await expect(page.locator('#themeToggle')).toHaveAttribute('aria-label', 'Toggle dark mode');
  });
});
