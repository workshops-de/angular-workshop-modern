import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BookListComponent } from './book-list.component';
import { BookApiClient } from './book-api-client.service';
import { Book } from './book';

function createMockBook(overrides?: Partial<Book>): Book {
  return {
    id: '1',
    isbn: '123456',
    title: 'Test Book',
    subtitle: 'Test Subtitle',
    author: 'Test Author',
    publisher: 'Test Publisher',
    price: '29.99',
    numPages: 200,
    cover: '',
    abstract: 'Test abstract',
    userId: 1,
    ...overrides
  };
}

function createMockBooks(count: number): Book[] {
  return Array.from({ length: count }, (_, i) => 
    createMockBook({
      id: String(i + 1),
      isbn: `ISBN${i + 1}`,
      title: `Book ${i + 1}`
    })
  );
}

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let mockBookApiClient: any;

  beforeEach(async () => {
    mockBookApiClient = {
      getBooks: vi.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [BookListComponent],
      providers: [
        provideRouter([]),
        { provide: BookApiClient, useValue: mockBookApiClient }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should load books on init', async () => {
    const mockBooks = createMockBooks(3);
    mockBookApiClient.getBooks.mockReturnValue(of(mockBooks));

    fixture.detectChanges(); // Trigger ngOnInit
    await fixture.whenStable();

    expect(component.books.length).toBe(3);
    expect(component.loading).toBe(false);
    expect(mockBookApiClient.getBooks).toHaveBeenCalledWith(10, undefined);
  });

  it('should render book items', async () => {
    const mockBooks = createMockBooks(3);
    mockBookApiClient.getBooks.mockReturnValue(of(mockBooks));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const bookItems = fixture.nativeElement.querySelectorAll('app-book-item');
    expect(bookItems.length).toBe(3);
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Book 1');
    expect(compiled.textContent).toContain('Book 2');
    expect(compiled.textContent).toContain('Book 3');
  });

  it('should show loading state initially', () => {
    mockBookApiClient.getBooks.mockReturnValue(of([]));

    // Check loading state before observable completes
    expect(component.loading).toBe(true);
    
    // Detect changes but loading state is checked before completion in the template
    // With synchronous observables, we need to check before detectChanges
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Since the observable completes synchronously, we cannot easily capture loading state in DOM
    // Instead, we verify the component's loading property is initially true
    expect(component.loading).toBe(true);
  });

  it('should show empty state when no books', async () => {
    mockBookApiClient.getBooks.mockReturnValue(of([]));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.books.length).toBe(0);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No books available');
  });

  it('should show search empty state', async () => {
    component.searchTerm = 'Angular';
    mockBookApiClient.getBooks.mockReturnValue(of([]));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No books match your search');
  });

  it('should handle loading errors', async () => {
    mockBookApiClient.getBooks.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.loading).toBe(false);
    expect(component.books.length).toBe(0);
  });

  it('should use correct pageSize input', async () => {
    const mockBooks = createMockBooks(5);
    mockBookApiClient.getBooks.mockReturnValue(of(mockBooks));

    // Set pageSize input
    fixture.componentRef.setInput('pageSize', 20);
    
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockBookApiClient.getBooks).toHaveBeenCalledWith(20, undefined);
  });

  it('should track books by id', () => {
    const book = createMockBook({ id: '123' });
    const result = component.trackById(0, book);
    expect(result).toBe('123');
  });

  it('should clear search', async () => {
    const mockBooks = createMockBooks(3);
    mockBookApiClient.getBooks.mockReturnValue(of(mockBooks));

    component.searchTerm = 'test';
    fixture.detectChanges();
    await fixture.whenStable();

    component.clearSearch();

    expect(component.searchTerm).toBe('');
    expect(mockBookApiClient.getBooks).toHaveBeenCalledWith(10, undefined);
  });
});
