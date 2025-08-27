import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { inject } from '@angular/core';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { Book } from '../book';
import { BookApiClient } from '../book-api-client.service';

type BookStoreState = {
  isLoading: boolean;
  books: Book[];
  searchTerm: string;
  pageSize: number;
};

const initialState: BookStoreState = {
  isLoading: false,
  books: [],
  searchTerm: '',
  pageSize: 10
};

export const BookStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, client = inject(BookApiClient)) => ({
    loadBooks: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => client.getBooks(store.pageSize(), store.searchTerm())),
        tap({
          next: books => patchState(store, { books, isLoading: false }),
          error: () => patchState(store, { isLoading: false })
        })
      )
    )
  })),
  withMethods(store => ({
    search: rxMethod<{ searchTerm: string }>(
      pipe(
        debounceTime(300),
        tap(({ searchTerm }) => patchState(store, { searchTerm })),
        tap(() => store.loadBooks())
      )
    ),
    clearSearch: () => {
      patchState(store, { searchTerm: '' });
      store.loadBooks();
    }
  })),
  withHooks(store => ({
    onInit: () => store.loadBooks()
  }))
);
