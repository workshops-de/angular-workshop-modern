import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { signalStore } from '@ngrx/signals';
import { withBooks } from './with-books';

describe('Signal Store', () => {
  describe('When store gets initialized', () => {
    it('bootstraps the store plugin', () => {
      const StoreWithBooks = signalStore(withBooks());

      TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), StoreWithBooks] });

      const store = TestBed.inject(StoreWithBooks);

      expect(store).toBeDefined();
    });

    it('provides the value of a resource', async () => {
      const StoreWithBooks = signalStore(withBooks());

      TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), StoreWithBooks] });

      const httpTesting = TestBed.inject(HttpTestingController);
      const store = TestBed.inject(StoreWithBooks);

      TestBed.tick();

      httpTesting.expectOne('http://localhost:4730/books?_limit=10&q=').flush([]);

      await new Promise(resolve => setTimeout(() => resolve(true), 0));

      expect(store.booksResource.value()).toEqual([]);
    });
  });
});
