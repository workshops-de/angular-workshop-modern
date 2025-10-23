import { inputBinding } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Book } from './book';
import { BookItemComponent } from './book-item.component';

describe('<app-book-item>', () => {
  describe('unit', () => {
    describe('When no content is passed', () => {
      it('defaults to "n/a"', () => {
        TestBed.runInInjectionContext(() => {
          const component = new BookItemComponent();

          const na = 'n/a';

          const content = component.book();

          expect(content.title).toBe(na);
          expect(content.subtitle).toBe(na);
          expect(content.author).toBe(na);
        });
      });
    });
  });

  describe('template', () => {
    describe('When a book is passed', () => {
      it('renders the content', async () => {
        const book = { title: 'Vitest - Angular Guide' } as Book;

        TestBed.configureTestingModule({ providers: [provideRouter([])] });
        const fixture = TestBed.createComponent(BookItemComponent, { bindings: [inputBinding('book', () => book)] });

        await fixture.whenStable();

        const titleFixture = fixture.debugElement.query(By.css('[data-testid="book-title"]'));
        const titleElement: HTMLElement = titleFixture.nativeElement;

        expect(titleElement.innerHTML).toContain(book.title);
      });
    });
  });
});
