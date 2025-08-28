import { Routes } from '@angular/router';
import { AboutComponent } from './about.component';
import { BookDetailComponent } from './books/book-detail.component';
import { BookEditComponent } from './books/book-edit.component';
import { BookListComponent } from './books/book-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: BookListComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: 'books/:id/edit', component: BookEditComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
