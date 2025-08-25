import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Book } from '../../shared/book.interface';

@Component({
  selector: 'app-book-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div class="relative pb-2/3">
        @if (book.cover) {
          <img [src]="book.cover" [alt]="book.title" class="w-full h-64 object-cover" />
        } @else {
          <div class="w-full h-64 bg-gray-200 flex items-center justify-center">
            <span class="text-gray-500">No image available</span>
          </div>
        }
      </div>
      <div class="p-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-1">{{ book.title }}</h2>
        @if (book.subtitle) {
          <p class="text-sm text-gray-600 mb-2">{{ book.subtitle }}</p>
        }
        <div class="text-sm text-gray-700 mt-2">
          <p>
            @if (book.authors && book.authors.length > 0) {
              <span>By: {{ formatAuthors(book.authors) }}</span>
            }
          </p>
          @if (book.isbn) {
            <p class="text-xs text-gray-500 mt-1">ISBN: {{ book.isbn }}</p>
          }
        </div>
      </div>
    </div>
  `
})
export class BookItemComponent {
  @Input() book!: Book;

  formatAuthors(authors: string[]): string {
    if (authors.length === 1) {
      return authors[0];
    } else if (authors.length === 2) {
      return authors.join(' & ');
    } else {
      return authors.join(', ');
    }
  }
}
