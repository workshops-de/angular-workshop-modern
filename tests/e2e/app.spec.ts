import { test, expect } from '@playwright/test';

test.describe('Application Basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/BookMonkey/);
  });

  test('should display the header', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const heading = header.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('BookMonkey');
  });

  test('should display navigation', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should display main content', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});
