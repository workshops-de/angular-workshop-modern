import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BookApiService } from '../shared/book-api.service';
import { Book } from '../shared/book.interface';
import { BookItemComponent } from './book-item/book-item.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, BookItemComponent],
  template: `
    <div class="container mx-auto px-4 py-12 max-w-7xl">
      <h1 class="text-3xl font-bold mb-10 text-blue-700 border-b pb-4 border-gray-200">Book Collection</h1>

      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <div class="animate-pulse flex flex-col items-center">
          <div
            class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
          ></div>
          <p class="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>

      <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        <app-book-item *ngFor="let book of books; trackBy: trackById" [book]="book"></app-book-item>

        <div
          *ngIf="books.length === 0"
          class="col-span-full flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p class="text-xl font-medium text-gray-600 mb-2">No books available</p>
          <p class="text-gray-500">Try adjusting your search or check back later</p>
        </div>
      </div>
    </div>
  `
})
export class BookListComponent implements OnInit {
  @Input() pageSize: number = 10;
  books: Book[] = [];
  loading: boolean = true;

  constructor(private bookApiService: BookApiService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks(): void {
    this.loading = true;
    this.bookApiService.getBooks(this.pageSize).subscribe({
      next: books => {
        this.books = books;
        this.loading = false;
      },
      error: error => {
        console.error('Error fetching books:', error);
        this.loading = false;
      }
    });
  }

  trackById(index: number, book: Book): string {
    return book.id;
  }
}
