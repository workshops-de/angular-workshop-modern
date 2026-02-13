import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BookDetailComponent } from './book-detail.component';
import { BookApiClient } from './book-api-client.service';
import { Book } from './book';

function createMockBook(overrides?: Partial<Book>): Book {
  return {
    id: '1',
    isbn: '123456',
    title: 'Test Book',
    subtitle: 'A test subtitle',
    author: 'Test Author',
    publisher: 'Test Publisher',
    price: '29.99',
    numPages: 200,
    cover: 'https://example.com/cover.jpg',
    abstract: 'Test abstract',
    userId: 1,
    ...overrides
  };
}

describe('BookDetailComponent', () => {
  let component: BookDetailComponent;
  let fixture: ComponentFixture<BookDetailComponent>;
  let mockBookApiClient: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockBookApiClient = {
      getBookById: vi.fn().mockReturnValue(of(createMockBook()))
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [BookDetailComponent],
      providers: [
        provideRouter([]),
        { provide: BookApiClient, useValue: mockBookApiClient },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should load book details on init', async () => {
    const mockBook = createMockBook({ title: 'Angular Testing' });
    mockBookApiClient.getBookById.mockReturnValue(of(mockBook));

    fixture.detectChanges(); // Trigger ngOnInit

    await fixture.whenStable(); // Wait for observable
    fixture.detectChanges(); // Update view

    expect(component.loading).toBe(false);
    expect(component.book).toEqual(mockBook);
    expect(fixture.nativeElement.textContent).toContain('Angular Testing');
  });

  it('should show loading state', () => {
    // Don't call detectChanges - just check initial state
    expect(component.loading).toBe(true);
  });

  it('should handle error when loading fails', async () => {
    mockBookApiClient.getBookById.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.error).toBeTruthy();
    expect(component.loading).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Could not load book details');
  });

  it('should handle missing book ID', () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue(null);

    fixture.detectChanges();

    expect(component.error).toBe('Book ID not found');
    expect(component.loading).toBe(false);
    expect(mockBookApiClient.getBookById).not.toHaveBeenCalled();
  });

  it('should navigate back to home', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const navigateSpy = vi.spyOn(component['router'], 'navigate');
    component.goBack();

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should display all book information correctly', async () => {
    const mockBook = createMockBook({
      title: 'Advanced Angular',
      subtitle: 'Expert Techniques',
      author: 'Jane Doe',
      publisher: 'Tech Books',
      isbn: '978-1234567890',
      price: '49.99',
      numPages: 450,
      abstract: 'Learn advanced Angular patterns'
    });
    mockBookApiClient.getBookById.mockReturnValue(of(mockBook));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Advanced Angular');
    expect(compiled.textContent).toContain('Expert Techniques');
    expect(compiled.textContent).toContain('Jane Doe');
    expect(compiled.textContent).toContain('Tech Books');
    expect(compiled.textContent).toContain('978-1234567890');
    expect(compiled.textContent).toContain('49.99');
    expect(compiled.textContent).toContain('450');
    expect(compiled.textContent).toContain('Learn advanced Angular patterns');
  });

  it('should handle book without cover', async () => {
    const mockBook = createMockBook({ cover: '' });
    mockBookApiClient.getBookById.mockReturnValue(of(mockBook));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');
    expect(img).toBeNull();
    expect(compiled.textContent).toContain('No cover available');
  });
});
