import { test, expect, ACTIVE_GROW_ID } from '../fixtures/test-fixtures.js';

test.describe('Notes', () => {
  test('notes list renders with icons, titles, and dates', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/notes`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.note-card', { timeout: 10000 });

    const cards = page.locator('.note-card');
    expect(await cards.count()).toBe(3);

    // First note (most recent by createdAt — "Slight yellowing")
    const firstCard = cards.first();
    await expect(firstCard.locator('.note-icon')).toBeVisible();
    await expect(firstCard.locator('.note-card-title')).toBeVisible();
    await expect(firstCard.locator('.note-date')).toBeVisible();
  });

  test('add note via modal', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/notes`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.notes-section-full', { timeout: 10000 });
    // Wait for notes to load
    await page.waitForTimeout(500);

    await page.click('#addNoteBtn');
    await expect(page.locator('#noteModal')).not.toHaveClass(/hidden/);
    await expect(page.locator('#noteModalTitle')).toHaveText('Add Note');

    // Fill out the note form
    await page.selectOption('#noteCategory', 'observation');
    await page.fill('#noteTitle', 'Test Note Title');
    await page.fill('#noteContent', 'Test note content from E2E test');
    await page.fill('#noteWeek', '4');
    await page.fill('#noteTags', 'test, e2e');

    // Save
    await page.click('#saveNoteBtn');
    await expect(page.locator('#noteModal')).toHaveClass(/hidden/);

    // Verify note appears in the list
    await expect(page.locator('.note-card')).toHaveCount(4);
    await expect(page.locator('text=Test Note Title')).toBeVisible();
  });

  test('edit note via modal', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/notes`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.note-card', { timeout: 10000 });

    // Click first note card to open edit modal
    await page.click('.note-card:first-child');
    await expect(page.locator('#noteModal')).not.toHaveClass(/hidden/);
    await expect(page.locator('#noteModalTitle')).toHaveText('Edit Note');

    // Delete button should be visible when editing
    await expect(page.locator('#deleteNoteBtn')).toBeVisible();

    // Modify the title
    await page.fill('#noteTitle', 'Updated Note Title');
    await page.click('#saveNoteBtn');

    await expect(page.locator('text=Updated Note Title')).toBeVisible();
  });

  test('delete note via modal', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/notes`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.note-card', { timeout: 10000 });

    const initialCount = await page.locator('.note-card').count();

    // Click a note to edit
    await page.click('.note-card:first-child');
    await expect(page.locator('#noteModal')).not.toHaveClass(/hidden/);

    // Click delete
    await page.click('#deleteNoteBtn');

    // Confirm modal should appear
    await expect(page.locator('.confirm-modal')).toBeVisible();
    await page.click('.confirm-modal button:has-text("Confirm")');

    // Note should be removed
    await expect(page.locator('.note-card')).toHaveCount(initialCount - 1);
  });

  test('filter by category', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/notes`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.note-card', { timeout: 10000 });

    await page.selectOption('#filterCategory', 'feeding');

    // Should only show feeding notes
    const cards = page.locator('.note-card');
    expect(await cards.count()).toBe(1);
    await expect(cards.first().locator('.note-category-badge')).toHaveText('feeding');
  });

  test('filter by week', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/notes`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.note-card', { timeout: 10000 });

    await page.fill('#filterWeek', '2');

    const cards = page.locator('.note-card');
    expect(await cards.count()).toBe(1);
    await expect(cards.first().locator('.note-week-badge')).toContainText('Week 2');
  });

  test('filter by text search', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/notes`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.note-card', { timeout: 10000 });

    await page.fill('#filterText', 'yellowing');

    const cards = page.locator('.note-card');
    expect(await cards.count()).toBe(1);
    await expect(cards.first().locator('.note-card-title')).toHaveText('Slight yellowing');
  });

  test('combined filters work together', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/notes`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.note-card', { timeout: 10000 });

    await page.selectOption('#filterCategory', 'issue');
    await page.fill('#filterText', 'yellowing');

    const cards = page.locator('.note-card');
    expect(await cards.count()).toBe(1);
  });

  test('modal dirty-state check on cancel', async ({ seededPage: page }) => {
    await page.evaluate((id) => { window.location.hash = `#/grow/${id}/notes`; }, ACTIVE_GROW_ID);
    await page.waitForSelector('.notes-section-full', { timeout: 10000 });
    await page.waitForTimeout(500);

    // Open add modal
    await page.click('#addNoteBtn');
    await expect(page.locator('#noteModal')).not.toHaveClass(/hidden/);

    // Type something to make it dirty
    await page.fill('#noteTitle', 'Dirty data');

    // Try to cancel
    await page.click('#cancelNoteBtn');

    // Confirm modal should appear asking to discard
    await expect(page.locator('.confirm-modal')).toBeVisible();
    await expect(page.locator('.confirm-modal')).toContainText('Discard unsaved changes');

    // Confirm discard
    await page.click('.confirm-modal button:has-text("Confirm")');
    await expect(page.locator('#noteModal')).toHaveClass(/hidden/);
  });
});
