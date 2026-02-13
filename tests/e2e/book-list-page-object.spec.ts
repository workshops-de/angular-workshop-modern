import { test, expect } from '@playwright/test';
import { BookListPage } from '../page-objects/book-list.page';

test.describe('Book List Page Object', () => {
  let bookList: BookListPage;

  test.beforeEach(async ({ page }) => {
    bookList = new BookListPage(page);
    await bookList.navigate();
  });

  test('should navigate using page object', async () => {
    const count = await bookList.getBookCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should display book titles', async () => {
    const firstTitle = await bookList.getBookTitle(0);
    expect(firstTitle).toBeTruthy();
    expect(firstTitle.length).toBeGreaterThan(0);
  });

  test('should have search input', async () => {
    const searchValue = await bookList.getSearchValue();
    expect(searchValue).toBe('');
  });

  test('should perform search', async ({ page }) => {
    await bookList.search('Angular');
    
    // Wait a bit for the search to execute
    await page.waitForTimeout(500);
    
    const searchValue = await bookList.getSearchValue();
    expect(searchValue).toBe('Angular');
  });
});
