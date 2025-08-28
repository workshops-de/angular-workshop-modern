import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from './book';

@Component({
  selector: 'app-book-item',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div
      class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
    >
      <div class="relative aspect-[3/4] overflow-hidden">
        @if (book().cover) {
          <img [src]="book().cover" [alt]="book().title" class="w-full h-full object-contain bg-gray-100" />
        }
        @if (!book().cover) {
          <div class="w-full h-full bg-gray-100 flex items-center justify-center">
            <span class="text-gray-500 text-sm font-medium">No cover available</span>
          </div>
        }
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <h2 class="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{{ book().title }}</h2>
        @if (book().subtitle) {
          <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ book().subtitle }}</p>
        }
        <div class="text-sm text-gray-700 mt-auto">
          <p>
            <span class="text-blue-700">{{ book().author }}</span>
          </p>
          @if (book().isbn) {
            <p class="text-xs text-gray-500 mt-2">ISBN: {{ book().isbn }}</p>
          }
        </div>
        <div class="px-5 pb-4 mt-2 flex flex-col space-y-2">
          <a
            [routerLink]="['/books', book().id]"
            class="block w-full text-center py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
          >
            View Details
          </a>
          <a
            [routerLink]="['/books', book().id, 'edit']"
            class="block w-full text-center py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Edit Book
          </a>
          <button
            (click)="addToBasketClick.emit(book())"
            class="block w-full text-center py-2 bg-orange-300 text-white rounded hover:bg-orange-400 transition-colors cursor-pointer"
          >
            Add to basket
          </button>
        </div>
      </div>
    </div>
  `
})
export class BookItemComponent {
  book = input.required<Book>();

  addToBasketClick = output<Book>();
}
