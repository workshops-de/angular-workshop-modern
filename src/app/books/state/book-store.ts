import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { computed, inject } from '@angular/core';
import { debounceTime, exhaustMap, pipe, switchMap, tap } from 'rxjs';

import { ToastService } from '../../shared/toast.service';
import { Book } from '../book';
import { BookApiClient } from '../book-api-client.service';

type BookStoreState = {
  isLoading: boolean;
  currentBookId: string | null;
  books: Book[];
  searchTerm: string;
  pageSize: number;
};

const initialState: BookStoreState = {
  isLoading: false,
  currentBookId: null,
  books: [],
  searchTerm: '',
  pageSize: 10
};

export const BookStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(store => ({
    bookByIdParam: computed(() => store.books().find(book => book.id === store.currentBookId()))
  })),
  withMethods((store, client = inject(BookApiClient), toast = inject(ToastService)) => ({
    loadBooks: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => client.getBooks(store.pageSize(), store.searchTerm())),
        tap({
          next: books => patchState(store, { books, isLoading: false }),
          error: () => patchState(store, { isLoading: false })
        })
      )
    ),
    updateBook: rxMethod<Book>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(book => client.updateBook(book)),
        tap({
          next: () => {
            patchState(store, { isLoading: false });
            toast.show('Book updated successfully!');
          },
          error: () => {
            patchState(store, { isLoading: false });
            toast.show('Error updating book. Please try again.', 5000);
          }
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
    },
    setCurrentBookId: (bookId: string | null) => patchState(store, { currentBookId: bookId })
  })),
  withHooks(store => ({
    onInit: () => store.loadBooks()
  }))
);
