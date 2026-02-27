// Custom Playwright fixtures with seeded and empty page variants
import { test as base, expect } from '@playwright/test';
import { getSeedLocalStorage, ACTIVE_GROW_ID, COMPLETED_GROW_ID } from './seed-data.js';

const test = base.extend({
  emptyPage: async ({ page }, use) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await use(page);
  },

  seededPage: async ({ page }, use) => {
    await page.goto('/');
    const seed = getSeedLocalStorage();
    await page.evaluate((data) => {
      localStorage.clear();
      for (const [key, value] of Object.entries(data)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }, seed);
    await page.reload();
    await use(page);
  },
});

export { test, expect, ACTIVE_GROW_ID, COMPLETED_GROW_ID };
