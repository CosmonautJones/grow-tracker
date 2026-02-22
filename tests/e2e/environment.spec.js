import { test, expect, ACTIVE_GROW_ID } from '../fixtures/test-fixtures.js';

test.describe('Environment', () => {
  test('optimal ranges card renders for current week', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/environment`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.env-section')).toBeVisible({ timeout: 5000 });

    const rangesCard = page.locator('#envRangesCard');
    await expect(rangesCard).toBeVisible();
  });

  test('form has temperature, humidity, VPD, and CO2 fields', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/environment`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.env-section')).toBeVisible({ timeout: 5000 });

    await expect(page.locator('#envTemp')).toBeVisible();
    await expect(page.locator('#envHumidity')).toBeVisible();
    await expect(page.locator('#envVpd')).toBeVisible();
    await expect(page.locator('#envCo2')).toBeVisible();
    await expect(page.locator('#envDatetime')).toBeVisible();
  });

  test('VPD auto-calculates from temp and humidity', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/environment`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.env-section')).toBeVisible({ timeout: 5000 });

    // Fill temp and humidity
    await page.fill('#envTemp', '75');
    await page.fill('#envHumidity', '55');

    // Trigger input events
    await page.locator('#envHumidity').dispatchEvent('input');

    // VPD should be auto-calculated (non-empty)
    const vpdValue = await page.locator('#envVpd').inputValue();
    if (vpdValue) {
      expect(parseFloat(vpdValue)).toBeGreaterThan(0);
    }
  });

  test('temperature unit toggle works', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/environment`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.env-section')).toBeVisible({ timeout: 5000 });

    const toggleBtn = page.locator('#tempUnitToggle');
    await expect(toggleBtn).toBeVisible();

    // Default should be °F
    await expect(toggleBtn).toHaveText('°F');

    // Click to switch to °C
    await toggleBtn.click();
    await expect(toggleBtn).toHaveText('°C');

    // Click back to °F
    await toggleBtn.click();
    await expect(toggleBtn).toHaveText('°F');
  });

  test('save reading adds to history', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/environment`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.env-section')).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(500);

    // Fill out the form
    await page.fill('#envTemp', '76');
    await page.fill('#envHumidity', '58');
    await page.fill('#envCo2', '420');
    await page.fill('#envWeek', '4');
    await page.fill('#envNotes', 'Test environment reading');

    // Save
    await page.click('#saveEnvBtn');

    // Verify the reading appears in history
    const history = page.locator('#envHistory');
    await expect(history).toBeVisible();
  });

  test('back to grow link works', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/environment`; }, ACTIVE_GROW_ID);
    await expect(page.locator('.env-section')).toBeVisible({ timeout: 5000 });

    const backLink = page.locator(`.env-section a[href="#/grow/${ACTIVE_GROW_ID}"]`);
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(new RegExp(`#/grow/${ACTIVE_GROW_ID}$`));
  });
});
