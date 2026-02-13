import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BookDetailComponent } from './book-detail.component';
import { BookApiClient } from './book-api-client.service';
import { createMockBook, provideMockActivatedRoute } from '../../test-utils/book.factory';

describe('BookDetailComponent', () => {
  let component: BookDetailComponent;
  let fixture: ComponentFixture<BookDetailComponent>;
  let mockBookApiClient: any;

  beforeEach(async () => {
    mockBookApiClient = {
      getBookById: vi.fn().mockReturnValue(of(createMockBook()))
    };

    await TestBed.configureTestingModule({
      imports: [BookDetailComponent],
      providers: [
        provideRouter([]),
        { provide: BookApiClient, useValue: mockBookApiClient },
        provideMockActivatedRoute({ id: '1' })
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
    mockBookApiClient.getBookById.mockReturnValue(throwError(() => new Error('API Error')));

    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.error).toBeTruthy();
    expect(component.loading).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Could not load book details');
  });

  it('should handle missing book ID', async () => {
    // Reconfigure TestBed with no id parameter for this specific test
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [BookDetailComponent],
      providers: [
        provideRouter([]),
        { provide: BookApiClient, useValue: mockBookApiClient },
        provideMockActivatedRoute({}) // No id parameter
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailComponent);
    component = fixture.componentInstance;

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
