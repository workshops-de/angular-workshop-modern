import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from '../shared/toast.service';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <h1 class="text-3xl font-bold mb-10 text-blue-700 border-b pb-4 border-gray-200">Edit Book</h1>

      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <div class="animate-pulse flex flex-col items-center">
          <div
            class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
          ></div>
          <p class="mt-4 text-gray-600">Loading book...</p>
        </div>
      </div>

      <div *ngIf="!loading && error" class="p-6 text-center bg-red-50 rounded-lg">
        <p class="text-red-700 font-medium text-lg mb-2">{{ error }}</p>
        <button
          (click)="goBack()"
          class="mt-4 px-6 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Back to Books
        </button>
      </div>

      <form
        *ngIf="!loading && !error && book"
        #bookForm="ngForm"
        (ngSubmit)="onSubmit()"
        class="bg-white rounded-lg shadow-lg overflow-hidden p-8"
      >
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
            (click)="goBack()"
            class="px-6 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            [disabled]="bookForm.invalid || saving"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class BookEditComponent implements OnInit {
  book: Book | null = null;
  loading: boolean = true;
  saving: boolean = false;
  error: string | null = null;

  @ViewChild('bookForm') bookForm!: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookApiService: BookApiClient,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      this.error = 'Book ID not found';
      return;
    }

    this.bookApiService.getBookById(id).subscribe({
      next: book => {
        this.book = { ...book }; // Create a copy to avoid direct mutation
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching book:', err);
        this.loading = false;
        this.error = 'Could not load book details. The book may not exist.';
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.invalid || !this.book) {
      return;
    }

    this.saving = true;
    this.bookApiService.updateBook(this.book).subscribe({
      next: updatedBook => {
        this.saving = false;
        this.toastService.show('Book updated successfully!');
        this.router.navigate(['/books', updatedBook.id]);
      },
      error: err => {
        console.error('Error updating book:', err);
        this.saving = false;
        this.toastService.show('Error updating book. Please try again.', 5000);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/books', this.book?.id || '']);
  }
}
