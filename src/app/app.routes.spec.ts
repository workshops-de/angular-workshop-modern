import { describe, it, expect, beforeEach } from 'vitest';
import { Location } from '@angular/common';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { BookApiClient } from './books/book-api-client.service';
import { provideMockBookApiClient, provideMockToastService } from '../test-utils/book.factory';

describe('App Routing', () => {
  let router: Router;
  let location: Location;
  let mockBookApiClient: BookApiClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideMockBookApiClient(),
        provideMockToastService()
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    mockBookApiClient = TestBed.inject(BookApiClient);
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
