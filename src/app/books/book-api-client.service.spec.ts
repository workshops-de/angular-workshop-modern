import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BookApiClient } from './book-api-client.service';
import { Book } from './book';

describe('BookApiClient', () => {
  let service: BookApiClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(BookApiClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should fetch books with default limit', () => {
    const mockBooks: Book[] = [
      {
        isbn: '123',
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: '29.99',
        numPages: 200,
        cover: '',
        abstract: 'Test abstract',
        id: '1',
        userId: 1
      }
    ];

    service.getBooks().subscribe(books => {
      expect(books).toEqual(mockBooks);
    });

    const req = httpMock.expectOne('http://localhost:4730/books?_limit=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockBooks);
  });

  it('should include search term in query parameters', () => {
    service.getBooks(10, 'angular').subscribe();

    const req = httpMock.expectOne(
      'http://localhost:4730/books?_limit=10&q=angular'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch a single book by ID', () => {
    const mockBook: Book = {
      isbn: '123456',
      title: 'Angular Testing',
      author: 'John Doe',
      publisher: 'Tech Press',
      price: '39.99',
      numPages: 300,
      cover: '',
      abstract: 'Learn Angular testing',
      id: '1',
      userId: 1
    };

    service.getBookById('1').subscribe(book => {
      expect(book).toEqual(mockBook);
    });

    const req = httpMock.expectOne('http://localhost:4730/books/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockBook);
  });

  it('should update a book', () => {
    const mockBook: Book = {
      isbn: '123456',
      title: 'Updated Book',
      author: 'Jane Doe',
      publisher: 'New Press',
      price: '49.99',
      numPages: 400,
      cover: '',
      abstract: 'Updated abstract',
      id: '1',
      userId: 1
    };

    service.updateBook(mockBook).subscribe(book => {
      expect(book).toEqual(mockBook);
    });

    const req = httpMock.expectOne('http://localhost:4730/books/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockBook);
    req.flush(mockBook);
  });

  it('should handle 404 error', () => {
    const errorMessage = 'Book not found';

    service.getBookById('invalid').subscribe({
      next: () => expect.fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne('http://localhost:4730/books/invalid');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
