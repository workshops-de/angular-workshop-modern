
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      @if (loading) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-pulse flex flex-col items-center">
            <div
              class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
            ></div>
            <p class="mt-4 text-gray-600">Loading book details...</p>
          </div>
        </div>
      }
    
      @if (!loading && error) {
        <div class="p-6 text-center bg-red-50 rounded-lg">
          <p class="text-red-700 font-medium text-lg mb-2">{{ error }}</p>
          <button
            (click)="goBack()"
            class="mt-4 px-6 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
            Back to Books
          </button>
        </div>
      }
    
      @if (!loading && !error && book) {
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
                  (click)="goBack()"
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
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookApiClient: BookApiClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      this.error = 'Book ID not found';
      return;
    }

    this.bookApiClient.getBookById(id).subscribe({
      next: book => {
        this.book = book;
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching book details:', err);
        this.loading = false;
        this.error = 'Could not load book details. The book may not exist.';
      }
    });
  }

  // No longer needed as we have a single author string
  // Method left for compatibility until we can remove it from the template

  goBack(): void {
    this.router.navigate(['/']);
  }
}
