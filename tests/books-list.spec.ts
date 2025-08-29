import { expect, test } from '@playwright/test';

test('When the book monkey is opened, it displays a list of books', async ({ page }) => {
  await page.goto('http://localhost:4200/books'); // cy

  await expect(page.getByTestId('book-item')).toHaveCount(10);
});
