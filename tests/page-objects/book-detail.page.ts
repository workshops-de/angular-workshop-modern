import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class BookDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators - Data Fields
  get title(): Locator {
    return this.page.locator('h1.text-3xl.text-gray-800');
  }

  get subtitle(): Locator {
    return this.page.locator('h1 + p');
  }

  get author(): Locator {
    return this.page.locator('.text-blue-700');
  }

  get isbn(): Locator {
    return this.page.locator('text=/ISBN:/');
  }

  get price(): Locator {
    return this.page.locator('.bg-blue-100');
  }

  get abstract(): Locator {
    return this.page.locator('text=/Abstract/i').locator('..').locator('p');
  }

  get publisher(): Locator {
    return this.page.locator('text=/Publisher:/');
  }

  get pages(): Locator {
    return this.page.locator('text=/Pages:/');
  }

  // Locators - Actions
  get editButton(): Locator {
    return this.page.locator('a:has-text("Edit Book")');
  }

  get backButton(): Locator {
    return this.page.locator('button:has-text("Back to Books")');
  }

  get loadingIndicator(): Locator {
    return this.page.locator('.animate-spin');
  }

  get errorMessage(): Locator {
    return this.page.locator('.bg-red-50');
  }

  // Navigation
  async navigateById(bookId: string) {
    await this.goto(`/books/${bookId}`);
    await this.waitForDetailsToLoad();
  }

  async waitForDetailsToLoad() {
    try {
      await this.page.waitForResponse(
        response => response.url().match(/\/books\/\w+$/) !== null && response.status() === 200,
        { timeout: 5000 }
      );
    } catch {
      // Response might be cached
    }
    await this.title.waitFor({ state: 'visible', timeout: 10000 });
  }

  // Getters
  async getTitle(): Promise<string> {
    return (await this.title.textContent()) || '';
  }

  async getSubtitle(): Promise<string> {
    try {
      return (await this.subtitle.textContent()) || '';
    } catch {
      return '';
    }
  }

  async getAuthor(): Promise<string> {
    return (await this.author.textContent()) || '';
  }

  async getIsbn(): Promise<string> {
    const text = (await this.isbn.textContent()) || '';
    return text.replace('ISBN:', '').trim();
  }

  async getPrice(): Promise<string> {
    return (await this.price.textContent()) || '';
  }

  async getPublisher(): Promise<string> {
    const text = (await this.publisher.textContent()) || '';
    return text.replace('Publisher:', '').trim();
  }

  async getPages(): Promise<string> {
    const text = (await this.pages.textContent()) || '';
    return text.replace('Pages:', '').trim();
  }

  async getAbstract(): Promise<string> {
    try {
      return (await this.abstract.textContent()) || '';
    } catch {
      return '';
    }
  }

  // Actions
  async clickEdit() {
    await this.editButton.click();
    await this.page.waitForURL(/\/books\/\w+\/edit$/);
  }

  async clickBack() {
    await this.backButton.click();
    await this.page.waitForURL('/');
  }

  // Helpers
  async hasAllFieldsVisible(): Promise<boolean> {
    return (
      (await this.title.isVisible()) &&
      (await this.author.isVisible()) &&
      (await this.isbn.isVisible()) &&
      (await this.price.isVisible())
    );
  }

  async isOnDetailPage(bookId?: string): Promise<boolean> {
    const url = this.page.url();
    if (bookId) {
      return url.includes(`/books/${bookId}`);
    }
    return /\/books\/\w+$/.test(url);
  }

  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
