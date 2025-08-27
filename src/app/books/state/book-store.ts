import { signalStore } from '@ngrx/signals';

import { withBooks } from './plugins/with-books';

export const BookStore = signalStore({ providedIn: 'root' }, withBooks());
