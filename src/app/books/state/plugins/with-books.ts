import { setLoaded, setLoading, withCallState, withImmutableState } from '@angular-architects/ngrx-toolkit';
import { httpResource } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStoreFeature, withComputed, withHooks, withMethods, withProps } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, exhaustMap, pipe, tap } from 'rxjs';
import { ToastService } from '../../../shared/toast.service';
import { Book } from '../../book';
import { BookApiClient } from '../../book-api-client.service';

type BookStoreState = {
  currentBookId: string | null;
  searchTerm: string;
  pageSize: number;
};

const initialState: BookStoreState = {
  currentBookId: null,
  searchTerm: '',
  pageSize: 10
};

export function withBooks() {
  return signalStoreFeature(
    withImmutableState(initialState),
    withCallState(),
    withProps(store => ({
      booksResource: httpResource<Book[]>(
        () => `http://localhost:4730/books?_limit=${store.pageSize()}&q=${store.searchTerm()}`
      )
    })),
    withComputed(store => ({
      bookByIdParam: computed(() => store.booksResource.value()?.find(book => book.id === store.currentBookId()))
    })),
    withMethods((store, client = inject(BookApiClient), toast = inject(ToastService)) => ({
      updateBook: rxMethod<Book>(
        pipe(
          tap(() => patchState(store, setLoading())),
          debounceTime(2_000), // used to see the loading state of the button in the UI
          exhaustMap(book => client.updateBook(book)),
          tap({
            next: () => {
              patchState(store, setLoaded());
              toast.show('Book updated successfully!');
            },
            error: () => {
              patchState(store, setLoaded());
              toast.show('Error updating book. Please try again.', 5000);
            }
          })
        )
      ),
      search: rxMethod<{ searchTerm: string }>(
        pipe(
          debounceTime(300),
          tap(({ searchTerm }) => patchState(store, { searchTerm })),
          tap(() => store.booksResource.reload())
        )
      ),
      clearSearch: () => {
        patchState(store, { searchTerm: '' });
        store.booksResource.reload();
      },
      setCurrentBookId: (bookId: string | null) => patchState(store, { currentBookId: bookId })
    })),
    withHooks(store => ({
      // onInit: () => store.booksResource.reload()
    }))
  );
}
