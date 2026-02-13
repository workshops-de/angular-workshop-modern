import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Location } from '@angular/common';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { BookApiClient } from './books/book-api-client.service';
import { ToastService } from './shared/toast.service';
import { of } from 'rxjs';

function createMockBook() {
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
    userId: 1
  };
}

describe('App Routing', () => {
  let router: Router;
  let location: Location;
  let mockBookApiClient: any;
  let mockToastService: any;

  beforeEach(async () => {
    mockBookApiClient = {
      getBooks: vi.fn().mockReturnValue(of([])),
      getBookById: vi.fn().mockReturnValue(of(createMockBook())),
      updateBook: vi.fn().mockReturnValue(of(createMockBook()))
    };

    mockToastService = {
      show: vi.fn()
    };

    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: BookApiClient, useValue: mockBookApiClient },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to root route', async () => {
    await router.navigate(['/']);
    
    expect(location.path()).toBe('');
  });

  it('should navigate to book detail', async () => {
    await router.navigate(['/books', '123']);
    
    expect(location.path()).toBe('/books/123');
  });

  it('should navigate to book edit', async () => {
    await router.navigate(['/books', '123', 'edit']);
    
    expect(location.path()).toBe('/books/123/edit');
  });

  it('should redirect invalid route to root', async () => {
    await router.navigate(['/invalid']);
    
    expect(location.path()).toBe('');
  });

  it('should navigate with RouterTestingHarness', async () => {
    const harness = await RouterTestingHarness.create('/');
    
    expect(location.path()).toBe('');
    
    await harness.navigateByUrl('/books/1');
    
    expect(location.path()).toBe('/books/1');
  });

  it('should create BookListComponent at root route', async () => {
    const harness = await RouterTestingHarness.create('/');
    
    expect(harness.routeDebugElement?.componentInstance).toBeDefined();
    expect(location.path()).toBe('');
  });

  it('should create BookDetailComponent at detail route', async () => {
    const harness = await RouterTestingHarness.create('/books/1');
    
    expect(harness.routeDebugElement?.componentInstance).toBeDefined();
    expect(location.path()).toBe('/books/1');
  });

  it('should create BookEditComponent at edit route', async () => {
    const harness = await RouterTestingHarness.create('/books/1/edit');
    
    expect(harness.routeDebugElement?.componentInstance).toBeDefined();
    expect(location.path()).toBe('/books/1/edit');
  });

  it('should support navigation between routes', async () => {
    // Start at list
    await router.navigate(['/']);
    expect(location.path()).toBe('');

    // Navigate to detail
    await router.navigate(['/books', '1']);
    expect(location.path()).toBe('/books/1');

    // Navigate to edit
    await router.navigate(['/books', '1', 'edit']);
    expect(location.path()).toBe('/books/1/edit');

    // Navigate back to list
    await router.navigate(['/']);
    expect(location.path()).toBe('');
  });

  it('should handle route parameters', async () => {
    const harness = await RouterTestingHarness.create('/books/42');
    
    expect(location.path()).toBe('/books/42');
    expect(mockBookApiClient.getBookById).toHaveBeenCalledWith('42');
  });
});
