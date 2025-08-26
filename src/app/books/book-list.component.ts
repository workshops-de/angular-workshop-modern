import { Component, Input, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { BookApiClient } from './book-api-client.service';
import { BookItemComponent } from './book-item.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [FormsModule, BookItemComponent],
  template: `
    <div class="container mx-auto px-4 py-12 max-w-7xl">
      <h1 class="text-3xl font-bold mb-10 text-blue-700 border-b pb-4 border-gray-200">Book Collection</h1>

      <div class="mb-6">
        <div class="flex items-center border-b-2 border-gray-300 py-2">
          <input
            type="text"
            [ngModel]="searchTerm()"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search for books..."
            class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          />
          @if (searchTerm()) {
            <button (click)="clearSearch()" class="flex-shrink-0 text-gray-500 hover:text-gray-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          }
        </div>
      </div>

      @if (booksResource.isLoading()) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-pulse flex flex-col items-center">
            <div
              class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
            ></div>
            <p class="mt-4 text-gray-600">Loading books...</p>
          </div>
        </div>
      }

      @if (booksResource.hasValue()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          @for (book of booksResource.value(); track book.id) {
            <app-book-item [book]="book"></app-book-item>
          }
          @if (booksResource.value().length === 0) {
            <div
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
              <p class="text-xl font-medium text-gray-600 mb-2">
                {{ searchTerm() ? 'No books match your search' : 'No books available' }}
              </p>
              <p class="text-gray-500">
                {{ searchTerm() ? 'Try different search terms or clear the search' : 'Check back later' }}
              </p>
              @if (searchTerm()) {
                <button
                  (click)="clearSearch()"
                  class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Clear Search
                </button>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class BookListComponent {
  private bookApiClient = inject(BookApiClient);

  @Input() pageSize: number = 10;
  searchTimeout: any;

  searchTerm = signal<string>('');
  booksResource = rxResource({
    params: () => ({ pageSize: this.pageSize, search: this.searchTerm() }),
    stream: ({ params }) => this.bookApiClient.getBooks(params.pageSize, params.search),
    defaultValue: []
  });

  onSearchChange(newSearchTerm: string): void {
    // Debounce search to avoid too many API calls while typing
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchTerm.set(newSearchTerm);
    }, 300);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }
}
