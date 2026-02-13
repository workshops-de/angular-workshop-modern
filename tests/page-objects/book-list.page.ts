import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class BookListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  get searchInput(): Locator {
    return this.page.locator('input[type="text"]');
  }

  get clearButton(): Locator {
    return this.page.locator('button:has(svg)');
  }

  get bookCards(): Locator {
    return this.page.locator('app-book-item');
  }

  get loadingIndicator(): Locator {
    return this.page.locator('.animate-spin');
  }

  get emptyMessage(): Locator {
    return this.page.locator('text=No books match your search');
  }

  // Navigation
  async navigate() {
    await this.goto('/');
    await this.waitForBooksToLoad();
  }

  async waitForBooksToLoad() {
    // Wait for either loading indicator to disappear or book cards to appear
    try {
      await this.page.waitForResponse(
        response => response.url().includes('/books') && response.status() === 200,
        { timeout: 5000 }
      );
    } catch {
      // If no response (e.g., cached), just wait for books
    }
    await this.bookCards.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  // Actions
  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clearSearch() {
    await this.clearButton.click();
  }

  async clickBook(index: number) {
    await this.bookCards.nth(index).click();
  }

  // Getters
  async getBookCount(): Promise<number> {
    return await this.bookCards.count();
  }

  async getBookTitle(index: number): Promise<string> {
    const title = this.bookCards.nth(index).locator('h2');
    return (await title.textContent()) || '';
  }

  async getSearchValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  async isLoading(): Promise<boolean> {
    return await this.loadingIndicator.isVisible();
  }
}
