import { Component, effect, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { Book } from './book';
import { BookStore } from './state/book-store';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [RouterModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <h1 class="text-3xl font-bold mb-10 text-blue-700 border-b pb-4 border-gray-200">Edit Book</h1>

      @if (book(); as book) {
        <form #bookForm="ngForm" (ngSubmit)="onSubmit()" class="bg-white rounded-lg shadow-lg overflow-hidden p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label for="title" class="block text-gray-700 font-medium mb-2">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                [(ngModel)]="book.title"
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="md:col-span-2">
              <label for="subtitle" class="block text-gray-700 font-medium mb-2">Subtitle</label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                [(ngModel)]="book.subtitle"
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="isbn" class="block text-gray-700 font-medium mb-2">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                [(ngModel)]="book.isbn"
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="author" class="block text-gray-700 font-medium mb-2">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                [(ngModel)]="book.author"
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="publisher" class="block text-gray-700 font-medium mb-2">Publisher</label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                [(ngModel)]="book.publisher"
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="numPages" class="block text-gray-700 font-medium mb-2">Pages</label>
              <input
                type="number"
                id="numPages"
                name="numPages"
                [(ngModel)]="book.numPages"
                required
                min="1"
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="price" class="block text-gray-700 font-medium mb-2">Price</label>
              <input
                type="text"
                id="price"
                name="price"
                [(ngModel)]="book.price"
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="cover" class="block text-gray-700 font-medium mb-2">Cover URL</label>
              <input
                type="text"
                id="cover"
                name="cover"
                [(ngModel)]="book.cover"
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="md:col-span-2">
              <label for="abstract" class="block text-gray-700 font-medium mb-2">Abstract</label>
              <textarea
                id="abstract"
                name="abstract"
                [(ngModel)]="book.abstract"
                rows="4"
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          <div class="mt-8 flex justify-between">
            <button
              type="button"
              routerLink="/"
              class="px-6 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="bookForm.invalid || isLoading()"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {{ isLoading() ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      }
    </div>
  `
})
export class BookEditComponent {
  private store = inject(BookStore);

  id = input<string>('');

  isLoading = this.store.isLoading;

  book = signal<Book>({} as Book);

  readonly bookForm = viewChild.required<NgForm>('bookForm');

  constructor() {
    effect(() => this.store.setCurrentBookId(this.id()));
    effect(() => this.fillBookForForm());
  }

  onSubmit(): void {
    if (this.bookForm().invalid) return;

    this.store.updateBook(this.book());
  }

  private fillBookForForm(): void {
    const book = this.store.bookByIdParam();

    if (!book) return;

    this.book.set(book);
  }
}
