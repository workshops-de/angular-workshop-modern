import { expect, test } from '@playwright/test';

test('When a book is added to the basket it calculates the total correctly', async ({ page }) => {
  await page.goto('http://localhost:4200/books');

  const bookShoppingBasketPlaceholder = page.getByTestId('book-shopping-basket-placeholder');

  await bookShoppingBasketPlaceholder.scrollIntoViewIfNeeded(); // Firefox broke??

  await expect(bookShoppingBasketPlaceholder).toBeVisible();

  await page.getByTestId('add-to-basket-button').first().click();

  await expect(bookShoppingBasketPlaceholder).not.toBeVisible();

  await expect(page.getByTestId('shopping-basket-total')).toContainText('100.01');
});
