import { Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookStore } from './state/book-store';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      @if (isLoading()) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-pulse flex flex-col items-center">
            <div
              class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
            ></div>
            <p class="mt-4 text-gray-600">Loading book details...</p>
          </div>
        </div>
      } @else if (book(); as book) {
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="flex flex-col md:flex-row">
            <div class="w-full md:w-1/3 bg-gray-100 p-6 flex items-center justify-center">
              @if (book.cover) {
                <img [src]="book.cover" [alt]="book.title" class="max-w-full max-h-96 object-contain" />
              }
              @if (!book.cover) {
                <div class="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500">
                  No cover available
                </div>
              }
            </div>
            <div class="w-full md:w-2/3 p-8">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h1 class="text-3xl font-bold text-gray-800">{{ book.title }}</h1>
                  @if (book.subtitle) {
                    <p class="text-xl text-gray-600 mt-2">{{ book.subtitle }}</p>
                  }
                </div>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {{ book.price }}
                </span>
              </div>
              <div class="mb-6">
                <p class="text-lg text-blue-700">{{ book.author }}</p>
                <p class="text-gray-600">Publisher: {{ book.publisher }}</p>
                <p class="text-gray-600">ISBN: {{ book.isbn }}</p>
                <p class="text-gray-600">Pages: {{ book.numPages }}</p>
              </div>
              @if (book.abstract) {
                <div class="mb-8">
                  <h2 class="text-xl font-semibold text-gray-800 mb-3">Abstract</h2>
                  <p class="text-gray-700">{{ book.abstract }}</p>
                </div>
              }
              <div class="flex space-x-4">
                <button
                  routerLink="/"
                  class="px-6 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Back to Books
                </button>
                <a
                  [routerLink]="['/books', book.id, 'edit']"
                  class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  Edit Book
                </a>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class BookDetailComponent {
  private store = inject(BookStore);

  protected book = this.store.bookByIdParam;
  protected isLoading = this.store.isLoading;

  id = input('id');

  constructor() {
    effect(() => this.store.setCurrentBookId(this.id()));
  }
}
