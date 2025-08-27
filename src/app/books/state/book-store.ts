import { signalStore, withState } from '@ngrx/signals';
import { Book } from '../book';

type BookStoreState = {
  books: Book[];
};

const initialState: BookStoreState = {
  books: []
};

export const BookStore = signalStore({ providedIn: 'root' }, withState(initialState));
