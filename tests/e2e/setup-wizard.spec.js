import { test, expect } from '../fixtures/test-fixtures.js';

test.describe('Setup Wizard', () => {
  test('renders 6-step progress bar', async ({ emptyPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/new'; });
    await expect(page.locator('.wizard-section')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#wizardStepText')).toHaveText('Step 1 of 6');
    await expect(page.locator('#wizardProgressFill')).toBeVisible();
  });

  test('step 1: plant type selection', async ({ emptyPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/new'; });
    await expect(page.locator('.wizard-section')).toBeVisible({ timeout: 5000 });

    // Autoflower should be selected by default
    const autoRadio = page.locator('input[name="plantType"][value="autoflower"]');
    await expect(autoRadio).toBeChecked();

    // Selecting photoperiod should show veg weeks input — click the label (radio input is hidden)
    await page.locator('label.wizard-radio-card', { has: page.locator('input[value="photoperiod"]') }).click();
    await expect(page.locator('#vegWeeks')).toBeVisible();

    // Switch back to autoflower — veg weeks should disappear
    await page.locator('label.wizard-radio-card', { has: page.locator('input[value="autoflower"]') }).click();
    await expect(page.locator('#vegWeeks')).not.toBeVisible();
  });

  test('step 2: strain name required validation', async ({ emptyPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/new'; });
    await expect(page.locator('.wizard-section')).toBeVisible({ timeout: 5000 });
    await page.click('#wizardNext'); // go to step 2
    await expect(page.locator('#wizardStepText')).toHaveText('Step 2 of 6');

    // Try to proceed without strain name
    await page.click('#wizardNext');
    // Should stay on step 2 with error
    await expect(page.locator('#wizardStepText')).toHaveText('Step 2 of 6');
    await expect(page.locator('#strainNameError')).toBeVisible();
  });

  test('step 3: medium and light setup', async ({ emptyPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/new'; });
    await expect(page.locator('.wizard-section')).toBeVisible({ timeout: 5000 });
    await page.click('#wizardNext'); // step 2
    await page.fill('#strainName', 'Test Strain');
    await page.click('#wizardNext'); // step 3
    await expect(page.locator('#wizardStepText')).toHaveText('Step 3 of 6');

    await expect(page.locator('#growMedium')).toBeVisible();
    await expect(page.locator('#lightSetup')).toBeVisible();
    await expect(page.locator('#lightSchedule')).toBeVisible();
  });

  test('step 4: nutrient brand dropdown', async ({ emptyPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/new'; });
    await expect(page.locator('.wizard-section')).toBeVisible({ timeout: 5000 });
    // Navigate to step 4
    await page.click('#wizardNext');
    await page.fill('#strainName', 'Test Strain');
    await page.click('#wizardNext');
    await page.click('#wizardNext');
    await expect(page.locator('#wizardStepText')).toHaveText('Step 4 of 6');

    await expect(page.locator('#nutrientBrand')).toBeVisible();
    await expect(page.locator('#defaultGallons')).toBeVisible();

    // Should have multiple brand options
    const options = page.locator('#nutrientBrand option');
    expect(await options.count()).toBeGreaterThan(1);
  });

  test('step 5: start date and auto-update toggle', async ({ emptyPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/new'; });
    await expect(page.locator('.wizard-section')).toBeVisible({ timeout: 5000 });
    // Navigate to step 5
    for (let i = 0; i < 4; i++) {
      if (i === 1) await page.fill('#strainName', 'Test Strain');
      await page.click('#wizardNext');
    }
    await expect(page.locator('#wizardStepText')).toHaveText('Step 5 of 6');

    await expect(page.locator('#startDate')).toBeVisible();
    await expect(page.locator('#autoUpdate')).toBeVisible();
    await expect(page.locator('#autoUpdate')).toBeChecked();
  });

  test('step 6: review shows all data', async ({ emptyPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/new'; });
    await expect(page.locator('.wizard-section')).toBeVisible({ timeout: 5000 });

    // Fill out wizard
    await page.click('#wizardNext'); // step 2
    await page.fill('#strainName', 'Test Strain Auto');
    await page.fill('#breeder', 'Test Breeder');
    await page.click('#wizardNext'); // step 3
    await page.selectOption('#growMedium', 'soil');
    await page.click('#wizardNext'); // step 4
    await page.click('#wizardNext'); // step 5
    await page.click('#wizardNext'); // step 6

    await expect(page.locator('#wizardStepText')).toHaveText('Step 6 of 6');

    const review = page.locator('.review-card');
    await expect(review).toContainText('Autoflower');
    await expect(review).toContainText('Test Strain Auto');
    await expect(review).toContainText('Test Breeder');
    await expect(review).toContainText('soil');
  });

  test('back button preserves data, hidden on step 1', async ({ emptyPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/new'; });
    await expect(page.locator('.wizard-section')).toBeVisible({ timeout: 5000 });

    // Back button should be hidden on step 1
    await expect(page.locator('#wizardBack')).toHaveCSS('visibility', 'hidden');

    // Go to step 2, fill data
    await page.click('#wizardNext');
    await expect(page.locator('#wizardBack')).toHaveCSS('visibility', 'visible');
    await page.fill('#strainName', 'Preserved Strain');

    // Go back, then forward — data should be preserved
    await page.click('#wizardBack');
    await expect(page.locator('#wizardStepText')).toHaveText('Step 1 of 6');
    await page.click('#wizardNext');
    await expect(page.locator('#strainName')).toHaveValue('Preserved Strain');
  });

  test('full happy path creates grow and redirects', async ({ emptyPage: page }) => {
    await page.evaluate(() => { window.location.hash = '#/new'; });
    await expect(page.locator('.wizard-section')).toBeVisible({ timeout: 5000 });

    // Step 1 — plant type (default autoflower)
    await page.click('#wizardNext');

    // Step 2 — strain name
    await page.fill('#strainName', 'E2E Test Grow');
    await page.click('#wizardNext');

    // Step 3 — medium + light
    await page.selectOption('#growMedium', 'coco');
    await page.click('#wizardNext');

    // Step 4 — nutrients
    await page.click('#wizardNext');

    // Step 5 — timeline
    await page.click('#wizardNext');

    // Step 6 — review
    await expect(page.locator('#wizardNext')).toHaveText('Start Growing!');
    await page.click('#wizardNext');

    // Should redirect to grow detail
    await expect(page).toHaveURL(/.*#\/grow\/local_\d+/, { timeout: 10000 });

    // Verify grow was created in localStorage
    const grows = await page.evaluate(() => {
      const raw = localStorage.getItem('gt_grows');
      return raw ? JSON.parse(raw) : {};
    });
    const growIds = Object.keys(grows);
    expect(growIds.length).toBeGreaterThan(0);
    const newGrow = grows[growIds[growIds.length - 1]];
    expect(newGrow.strainName).toBe('E2E Test Grow');
    expect(newGrow.growMedium).toBe('coco');
  });
});
