/**
 * Manual auth setup — opens headed browser for Google sign-in.
 * Run with: npm run test:auth-setup
 *
 * This script opens the app in a headed browser and waits for you
 * to manually sign in via Google popup. Once signed in, it saves
 * the browser's storageState (cookies + localStorage) to .auth/storageState.json
 * so that the `authenticated` project can reuse it.
 */
import { test as setup } from '@playwright/test';
import { existsSync, mkdirSync } from 'fs';

const AUTH_FILE = '.auth/storageState.json';

setup('authenticate with Google', async ({ page }) => {
  // Ensure .auth directory exists
  if (!existsSync('.auth')) {
    mkdirSync('.auth', { recursive: true });
  }

  await page.goto('/');

  // Wait for the app to load
  await page.waitForSelector('#signInBtn', { timeout: 10000 });

  console.log('\n=== MANUAL AUTH SETUP ===');
  console.log('1. Click "Sign In to Sync" in the app header');
  console.log('2. Complete Google sign-in in the popup');
  console.log('3. Wait for your email to appear in the header');
  console.log('========================\n');

  // Wait for the user to sign in — look for the user email to appear
  await page.waitForSelector('#userEmail', { timeout: 120000 });

  // Verify sign-in
  const email = await page.locator('#userEmail').textContent();
  console.log(`Signed in as: ${email}`);

  // Save auth state
  await page.context().storageState({ path: AUTH_FILE });
  console.log(`Auth state saved to ${AUTH_FILE}`);
});
