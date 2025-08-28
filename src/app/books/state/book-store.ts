import { signalStore } from '@ngrx/signals';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withBooks } from './plugins/with-books';

export const BookStore = signalStore({ providedIn: 'root' }, withBooks(), withDevtools('books'));
