import { test, expect } from '@playwright/test';
import { BookListPage } from '../page-objects/book-list.page';
import { BookDetailPage } from '../page-objects/book-detail.page';

test.describe('Book Detail View', () => {
  let bookList: BookListPage;
  let bookDetail: BookDetailPage;

  test.beforeEach(async ({ page }) => {
    bookList = new BookListPage(page);
    bookDetail = new BookDetailPage(page);
  });

  test('should navigate to book detail by ID', async ({ page }) => {
    await bookDetail.navigateById('1001606140805');

    await expect(page).toHaveURL(/\/books\/1001606140805$/);
    await expect(bookDetail.title).toBeVisible();
  });

  test('should navigate from list to detail', async ({ page }) => {
    await bookList.navigate();

    // Click the first "View Details" link
    await bookList.bookCards.first().locator('a', { hasText: 'View Details' }).click();

    await expect(page).toHaveURL(/\/books\/\w+$/);
    await expect(bookDetail.title).toBeVisible();
  });

  test('should display all book information fields', async () => {
    await bookDetail.navigateById('1001606140805');

    await expect(bookDetail.title).toBeVisible();
    await expect(bookDetail.author).toBeVisible();
    await expect(bookDetail.isbn).toBeVisible();
    await expect(bookDetail.price).toBeVisible();
  });

  test('should display book information with valid content', async () => {
    await bookDetail.navigateById('1001606140805');

    const title = await bookDetail.getTitle();
    expect(title.length).toBeGreaterThan(0);

    const author = await bookDetail.getAuthor();
    expect(author.length).toBeGreaterThan(0);

    const isbn = await bookDetail.getIsbn();
    expect(isbn.length).toBeGreaterThan(0);

    const price = await bookDetail.getPrice();
    expect(price.length).toBeGreaterThan(0);
  });

  test('should navigate back to list with back button', async ({ page }) => {
    const bookList = new BookListPage(page);
    await bookList.navigate();
    await bookList.bookCards.first().locator('a', { hasText: 'View Details' }).click();

    await bookDetail.clickBack();

    await expect(page).toHaveURL('/');
    await expect(bookList.bookCards.first()).toBeVisible();
  });

  test('should navigate to edit page with edit button', async ({ page }) => {
    await bookDetail.navigateById('1001606140805');

    await bookDetail.clickEdit();

    await expect(page).toHaveURL(/\/books\/\w+\/edit$/);
  });

  test('should use browser back button', async ({ page }) => {
    // Start at list page to establish history
    await bookList.navigate();
    
    // Navigate to detail
    await bookDetail.navigateById('1001606140805');
    const originalUrl = page.url();

    // Go back to list
    await page.goBack();
    await expect(page).toHaveURL('/');

    // Go forward to detail again
    await page.goForward();
    await expect(page).toHaveURL(originalUrl);
  });

  test('should display different books correctly', async ({ page }) => {
    await bookDetail.navigateById('1001606140805');
    const title1 = await bookDetail.getTitle();

    // Navigate to list first to ensure clean navigation
    await bookList.navigate();
    
    await bookDetail.navigateById('9780071494618');
    const title2 = await bookDetail.getTitle();

    expect(title1).not.toBe(title2);
    expect(title2.length).toBeGreaterThan(0);
  });
});
