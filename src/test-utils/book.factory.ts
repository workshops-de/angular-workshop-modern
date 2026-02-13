import { Provider } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../app/books/book';
import { BookApiClient } from '../app/books/book-api-client.service';
import { ToastService } from '../app/shared/toast.service';

export function createMockBook(overrides?: Partial<Book>): Book {
  return {
    id: '1',
    isbn: '123456',
    title: 'Test Book',
    subtitle: 'A test subtitle',
    author: 'Test Author',
    publisher: 'Test Publisher',
    price: '29.99',
    numPages: 200,
    cover: 'https://example.com/cover.jpg',
    abstract: 'Test abstract description',
    userId: 1,
    ...overrides
  };
}

export function createMockBooks(count: number): Book[] {
  return Array.from({ length: count }, (_, i) =>
    createMockBook({
      id: String(i + 1),
      isbn: `ISBN${i + 1}`,
      title: `Book ${i + 1}`,
      author: `Author ${i + 1}`
    })
  );
}

export function provideMockBookApiClient(overrides?: Partial<Record<keyof BookApiClient, any>>): Provider {
  return {
    provide: BookApiClient,
    useValue: {
      getBooks: vi.fn().mockReturnValue(of([])),
      getBookById: vi.fn().mockReturnValue(of(createMockBook())),
      updateBook: vi.fn().mockReturnValue(of(createMockBook())),
      ...overrides
    }
  };
}

export function provideMockToastService(): Provider {
  return {
    provide: ToastService,
    useValue: {
      show: vi.fn()
    }
  };
}

export function provideMockRouter(): Provider {
  return {
    provide: Router,
    useValue: {
      navigate: vi.fn().mockResolvedValue(true),
      navigateByUrl: vi.fn().mockResolvedValue(true)
    }
  };
}

export function provideMockActivatedRoute(params: Record<string, string>): Provider {
  return {
    provide: ActivatedRoute,
    useValue: {
      snapshot: {
        paramMap: {
          get: (key: string) => params[key] || null
        }
      }
    }
  };
}
