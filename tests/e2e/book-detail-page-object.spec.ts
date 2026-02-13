import { test, expect } from '@playwright/test';
import { BookDetailPage } from '../page-objects/book-detail.page';

test.describe('Book Detail Page Object', () => {
  let bookDetail: BookDetailPage;

  test.beforeEach(async ({ page }) => {
    bookDetail = new BookDetailPage(page);
  });

  test('should navigate to book detail and display title', async () => {
    await bookDetail.navigateById('1001606140805');

    const title = await bookDetail.getTitle();
    expect(title.length).toBeGreaterThan(0);

    await expect(bookDetail.title).toBeVisible();
  });

  test('should display all book fields', async () => {
    await bookDetail.navigateById('1001606140805');

    const hasAllFields = await bookDetail.hasAllFieldsVisible();
    expect(hasAllFields).toBe(true);
  });

  test('should retrieve book data', async () => {
    await bookDetail.navigateById('1001606140805');

    const title = await bookDetail.getTitle();
    const author = await bookDetail.getAuthor();
    const isbn = await bookDetail.getIsbn();
    const price = await bookDetail.getPrice();

    expect(title).toBeTruthy();
    expect(author).toBeTruthy();
    expect(isbn).toBeTruthy();
    expect(price).toBeTruthy();
  });

  test('should verify on detail page', async () => {
    await bookDetail.navigateById('1001606140805');

    const isOnPage = await bookDetail.isOnDetailPage('1001606140805');
    expect(isOnPage).toBe(true);
  });

  test('should display edit button', async () => {
    await bookDetail.navigateById('1001606140805');

    await expect(bookDetail.editButton).toBeVisible();
  });

  test('should display back button', async () => {
    await bookDetail.navigateById('1001606140805');

    await expect(bookDetail.backButton).toBeVisible();
  });
});
