import { test, expect } from '@playwright/test';
import { BookListPage } from '../page-objects/book-list.page';

test.describe('Book List', () => {
  let bookList: BookListPage;

  test.beforeEach(async ({ page }) => {
    bookList = new BookListPage(page);
    await bookList.navigate();
  });

  test('should display books after loading', async () => {
    const count = await bookList.getBookCount();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('should display book information in cards', async () => {
    const firstBook = bookList.bookCards.first();

    await expect(firstBook).toBeVisible();

    const title = await bookList.getBookTitle(0);
    expect(title.length).toBeGreaterThan(0);
  });

  test('should render all book cards as visible', async () => {
    const count = await bookList.getBookCount();
    expect(count).toBeGreaterThanOrEqual(5);

    // Verify all are visible
    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(bookList.bookCards.nth(i)).toBeVisible();
    }
  });

  test('should display book titles', async () => {
    const title1 = await bookList.getBookTitle(0);
    const title2 = await bookList.getBookTitle(1);
    const title3 = await bookList.getBookTitle(2);

    expect(title1.length).toBeGreaterThan(0);
    expect(title2.length).toBeGreaterThan(0);
    expect(title3.length).toBeGreaterThan(0);

    // Titles should be different
    expect(title1).not.toBe(title2);
    expect(title2).not.toBe(title3);
  });

  test('should display book card structure', async () => {
    const firstBook = bookList.bookCards.first();

    // Verify structure elements exist
    await expect(firstBook.locator('h2')).toBeVisible();
    await expect(firstBook.locator('.text-blue-700')).toBeVisible(); // Author
    await expect(firstBook.locator('a[href*="/books/"]').first()).toBeVisible(); // Link
  });

  test('should display empty state when no books found', async ({ page }) => {
    await bookList.search('XXXNONEXISTENT');

    // Wait for search debounce and API call
    await page.waitForTimeout(600);

    await expect(bookList.bookCards).toHaveCount(0);
    await expect(bookList.emptyMessage).toBeVisible();
  });

  test('should maintain book list after navigation', async ({ page }) => {
    const initialCount = await bookList.getBookCount();

    // Click the first "View Details" link
    await bookList.bookCards.first().locator('a', { hasText: 'View Details' }).click();
    await page.waitForURL(/\/books\/\w+$/);

    await page.goBack();
    await bookList.waitForBooksToLoad();

    const finalCount = await bookList.getBookCount();
    expect(finalCount).toBe(initialCount);
  });
});
