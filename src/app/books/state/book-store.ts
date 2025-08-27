import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { Book } from '../book';
import { BookApiClient } from '../book-api-client.service';

type BookStoreState = {
  isLoading: boolean;
  books: Book[];
};

const initialState: BookStoreState = {
  isLoading: false,
  books: []
};

export const BookStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, client = inject(BookApiClient)) => ({
    loadBooks: rxMethod<{ pageSize: number; searchTerm: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(props => client.getBooks(props.pageSize, props.searchTerm)),
        tap({
          next: books => patchState(store, { books, isLoading: false }),
          error: () => patchState(store, { isLoading: false })
        })
      )
    )
  })),
  withHooks(store => ({
    onInit: () => store.loadBooks({ pageSize: 10, searchTerm: '' })
  }))
);
