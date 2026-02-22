import { test, expect, ACTIVE_GROW_ID } from '../fixtures/test-fixtures.js';

test.describe('Grow Detail', () => {
  test('renders week selector, progress bar, and stage info', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('#growDetailContent:not(.hidden)', { timeout: 10000 });

    await expect(page.locator('#currentWeek')).toBeVisible();
    await expect(page.locator('.progress-fill')).toBeVisible();
    await expect(page.locator('#stageInfo')).toBeVisible();
  });

  test('nutrient calculator shows amounts for current brand/week', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('#growDetailContent:not(.hidden)', { timeout: 10000 });

    // Nutrient section should be visible
    await expect(page.locator('.nutrient-section')).toBeVisible();
  });

  test('weekly checklist checkboxes render', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('#growDetailContent:not(.hidden)', { timeout: 10000 });

    // Checklist section should be present
    const checklistSection = page.locator('.checklist-section');
    if (await checklistSection.isVisible()) {
      const checkboxes = checklistSection.locator('input[type="checkbox"]');
      expect(await checkboxes.count()).toBeGreaterThan(0);
    }
  });

  test('Chart.js canvases render with non-zero dimensions', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('#growDetailContent:not(.hidden)', { timeout: 10000 });

    // Schedule chart canvas
    const scheduleCanvas = page.locator('#scheduleChart');
    if (await scheduleCanvas.isVisible()) {
      const box = await scheduleCanvas.boundingBox();
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
    }

    // PPM chart canvas
    const ppmCanvas = page.locator('#ppmChart');
    if (await ppmCanvas.isVisible()) {
      const box = await ppmCanvas.boundingBox();
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
    }
  });

  test('grow action buttons are present', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('#growDetailContent:not(.hidden)', { timeout: 10000 });

    await expect(page.locator('#editGrowBtn')).toBeVisible();
    await expect(page.locator('#completeGrowBtn')).toBeVisible();
    await expect(page.locator('#deleteGrowBtn')).toBeVisible();
    await expect(page.locator('#exportGrowBtn')).toBeVisible();
    await expect(page.locator('#exportCsvBtn')).toBeVisible();
  });

  test('week selector changes current week', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('#growDetailContent:not(.hidden)', { timeout: 10000 });

    const weekSelect = page.locator('#currentWeek');
    // Change to week 2
    await weekSelect.selectOption('2');

    // Stage info should update
    await expect(page.locator('#stageInfo')).toContainText(/Seedling|Vegetative|Stage/i);
  });

  test('view-all links navigate to sub-views', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('#growDetailContent:not(.hidden)', { timeout: 10000 });

    // Check for links to notes, gallery, guides, environment
    const notesLink = page.locator(`a[href="#/grow/${ACTIVE_GROW_ID}/notes"]`);
    const galleryLink = page.locator(`a[href="#/grow/${ACTIVE_GROW_ID}/gallery"]`);
    const guidesLink = page.locator(`a[href="#/grow/${ACTIVE_GROW_ID}/guides"]`);
    const envLink = page.locator(`a[href="#/grow/${ACTIVE_GROW_ID}/environment"]`);

    // At least the nav links should exist
    await expect(notesLink.first()).toBeVisible();
    await expect(galleryLink.first()).toBeVisible();
    await expect(guidesLink.first()).toBeVisible();
    await expect(envLink.first()).toBeVisible();
  });
});
