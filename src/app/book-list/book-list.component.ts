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
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-blue-600">Books</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (book of books; track book.id) {
          <app-book-item [book]="book"></app-book-item>
        } @empty {
          <div class="col-span-full text-center py-12">
            <p class="text-gray-500">No books available</p>
          </div>
        }
      </div>
    </div>
  `
})
export class BookListComponent implements OnInit {
  @Input() pageSize: number = 10;
  books: Book[] = [];

  constructor(private bookApiService: BookApiService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks(): void {
    this.bookApiService.getBooks(this.pageSize).subscribe({
      next: books => {
        this.books = books;
      },
      error: error => {
        console.error('Error fetching books:', error);
      }
    });
  }
}
