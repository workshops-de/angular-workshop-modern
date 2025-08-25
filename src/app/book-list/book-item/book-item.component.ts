import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Book } from '../../shared/book.interface';

@Component({
  selector: 'app-book-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
    >
      <div class="relative aspect-[3/4] overflow-hidden">
        <img
          *ngIf="book.cover"
          [src]="book.cover"
          [alt]="book.title"
          class="w-full h-full object-contain bg-gray-100"
        />
        <div *ngIf="!book.cover" class="w-full h-full bg-gray-100 flex items-center justify-center">
          <span class="text-gray-500 text-sm font-medium">No cover available</span>
        </div>
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <h2 class="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{{ book.title }}</h2>
        <p *ngIf="book.subtitle" class="text-sm text-gray-600 mb-2 line-clamp-2">{{ book.subtitle }}</p>
        <div class="text-sm text-gray-700 mt-auto">
          <p>
            <span *ngIf="book.authors && book.authors.length > 0" class="text-blue-700">{{
              formatAuthors(book.authors)
            }}</span>
          </p>
          <p *ngIf="book.isbn" class="text-xs text-gray-500 mt-2">ISBN: {{ book.isbn }}</p>
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
