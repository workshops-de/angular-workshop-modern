import { Routes } from '@angular/router';
import { BookDetailComponent } from './books/book-detail.component';
import { BookEditComponent } from './books/book-edit.component';
import { BookListComponent } from './books/book-list.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: 'books/:id/edit', component: BookEditComponent },
  { path: '**', redirectTo: '' }
];
