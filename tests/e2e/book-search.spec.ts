import { test, expect } from '@playwright/test';
import { BookListPage } from '../page-objects/book-list.page';

test.describe('Book Search', () => {
  let bookList: BookListPage;

  test.beforeEach(async ({ page }) => {
    bookList = new BookListPage(page);
    await bookList.navigate();
  });

  test('should update search input value', async () => {
    await bookList.search('Angular');

    const searchValue = await bookList.getSearchValue();
    expect(searchValue).toBe('Angular');
  });

  test('should filter books based on search term', async ({ page }) => {
    const initialCount = await bookList.getBookCount();

    await bookList.search('Angular');
    // Wait for debounce and search to complete
    await page.waitForTimeout(500);

    const filteredCount = await bookList.getBookCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('should debounce search requests', async ({ page }) => {
    let requestCount = 0;

    page.on('request', request => {
      if (request.url().includes('/books?search=')) {
        requestCount++;
      }
    });

    // Type characters with small delays
    await bookList.searchInput.pressSequentially('Angular', { delay: 50 });

    // Wait for debounce to complete
    await page.waitForTimeout(500);

    // Should only make 1-2 requests max (Angular is final search)
    expect(requestCount).toBeLessThanOrEqual(2);
  });

  test('should clear search and restore all books', async ({ page }) => {
    await bookList.search('Angular');
    await page.waitForTimeout(500);

    const filteredCount = await bookList.getBookCount();

    await bookList.clearSearch();
    await page.waitForTimeout(400);

    const fullCount = await bookList.getBookCount();
    expect(fullCount).toBeGreaterThan(filteredCount);

    const searchValue = await bookList.getSearchValue();
    expect(searchValue).toBe('');
  });

  test('should show empty state when no results', async ({ page }) => {
    await bookList.search('ZZZNONEXISTENT');
    await page.waitForTimeout(400);

    await expect(bookList.bookCards).toHaveCount(0);
    await expect(bookList.emptyMessage).toBeVisible();
  });

  test('should display books matching search term', async ({ page }) => {
    await bookList.search('Angular');
    await page.waitForTimeout(500);

    const count = await bookList.getBookCount();
    expect(count).toBeGreaterThan(0);

    // Get first book title and verify it contains the search term
    const title = await bookList.getBookTitle(0);
    expect(title.toLowerCase()).toContain('angular');
  });

  test('should handle rapid typing with debounce', async ({ page }) => {
    const requests: string[] = [];

    page.on('request', request => {
      if (request.url().includes('/books?search=')) {
        requests.push(request.url());
      }
    });

    // Type very quickly
    await bookList.searchInput.pressSequentially('Test', { delay: 30 });

    // Wait for debounce
    await page.waitForTimeout(500);

    // Should have minimal requests despite rapid typing
    expect(requests.length).toBeLessThanOrEqual(2);
  });
});
