import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BookEditComponent } from './book-edit.component';
import { BookApiClient } from './book-api-client.service';
import { ToastService } from '../shared/toast.service';
import { createMockBook, provideMockActivatedRoute } from '../../test-utils/book.factory';

describe('BookEditComponent - Form Validation', () => {
  let component: BookEditComponent;
  let fixture: ComponentFixture<BookEditComponent>;
  let mockBookApiClient: any;
  let mockToastService: any;

  beforeEach(async () => {
    mockBookApiClient = {
      getBookById: vi.fn().mockReturnValue(of(createMockBook())),
      updateBook: vi.fn().mockReturnValue(of(createMockBook()))
    };

    mockToastService = {
      show: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BookEditComponent],
      providers: [
        provideRouter([]),
        { provide: BookApiClient, useValue: mockBookApiClient },
        provideMockActivatedRoute({ id: '1' }),
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookEditComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should initialize form with book data', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.book?.title).toBe('Test Book');
    expect(component.bookForm().valid).toBe(true);
  });

  it('should mark form invalid when title is empty', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.book!.title = '';
    fixture.detectChanges();
    await fixture.whenStable();

    const form = component.bookForm();
    expect(form.valid).toBe(false);
    expect(form.controls['title'].errors?.['required']).toBe(true);
  });

  it('should validate multiple required fields', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.book!.title = '';
    component.book!.author = '';
    component.book!.publisher = '';
    fixture.detectChanges();
    await fixture.whenStable();

    const form = component.bookForm();
    expect(form.valid).toBe(false);
    expect(form.controls['title'].hasError('required')).toBe(true);
    expect(form.controls['author'].hasError('required')).toBe(true);
    expect(form.controls['publisher'].hasError('required')).toBe(true);
  });

  it('should validate numPages minimum value', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.book!.numPages = 0;
    fixture.detectChanges();
    await fixture.whenStable();

    const form = component.bookForm();
    expect(form.valid).toBe(false);
    expect(form.controls['numPages'].hasError('min')).toBe(true);
  });

  it('should disable submit button when form is invalid', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.book!.title = '';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBe(true);
  });

  it('should enable submit button when form is valid', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBe(false);
  });

  it('should validate all required fields', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.book!.isbn = '';
    component.book!.price = '';
    fixture.detectChanges();
    await fixture.whenStable();

    const form = component.bookForm();
    expect(form.valid).toBe(false);
    expect(form.controls['isbn'].hasError('required')).toBe(true);
    expect(form.controls['price'].hasError('required')).toBe(true);
  });

  it('should allow optional fields to be empty', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.book!.subtitle = '';
    component.book!.cover = '';
    component.book!.abstract = '';
    fixture.detectChanges();
    await fixture.whenStable();

    const form = component.bookForm();
    expect(form.valid).toBe(true);
  });
});

describe('BookEditComponent - Form Submission', () => {
  let component: BookEditComponent;
  let fixture: ComponentFixture<BookEditComponent>;
  let mockBookApiClient: any;
  let mockToastService: any;
  let mockRouter: Router;

  beforeEach(async () => {
    mockBookApiClient = {
      getBookById: vi.fn().mockReturnValue(of(createMockBook())),
      updateBook: vi.fn().mockReturnValue(of(createMockBook()))
    };

    mockToastService = {
      show: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BookEditComponent],
      providers: [
        provideRouter([]),
        { provide: BookApiClient, useValue: mockBookApiClient },
        provideMockActivatedRoute({ id: '1' }),
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookEditComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    vi.spyOn(mockRouter, 'navigate');
  });

  it('should submit form successfully', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const updatedBook = { ...component.book!, title: 'Updated Title' };
    component.book = updatedBook;

    // Saving state is true immediately after onSubmit starts, but completes synchronously
    component.onSubmit();

    // With synchronous observables (of()), the saving state completes immediately
    // So we check the final state and service calls

    await fixture.whenStable();

    expect(mockBookApiClient.updateBook).toHaveBeenCalledWith(updatedBook);
    expect(component.saving).toBe(false);
    expect(mockToastService.show).toHaveBeenCalledWith('Book updated successfully!');
  });

  it('should show saving state during submission', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    // With synchronous observables, we can spy on the state
    let savingDuringCall = false;
    const originalUpdateBook = mockBookApiClient.updateBook;
    mockBookApiClient.updateBook = vi.fn().mockImplementation((...args: any[]) => {
      savingDuringCall = component.saving;
      return originalUpdateBook(...args);
    });

    component.onSubmit();

    await fixture.whenStable();

    expect(savingDuringCall).toBe(true);
    expect(component.saving).toBe(false);
  });

  it('should not submit when form is invalid', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.book!.title = '';
    fixture.detectChanges();
    await fixture.whenStable();

    component.onSubmit();

    expect(mockBookApiClient.updateBook).not.toHaveBeenCalled();
    expect(mockToastService.show).not.toHaveBeenCalled();
  });

  it('should handle submission errors', async () => {
    mockBookApiClient.updateBook.mockReturnValue(throwError(() => new Error('Save failed')));

    fixture.detectChanges();
    await fixture.whenStable();

    component.onSubmit();

    await fixture.whenStable();

    expect(component.saving).toBe(false);
    expect(mockToastService.show).toHaveBeenCalledWith('Error updating book. Please try again.', 5000);
  });

  it('should handle form submission via form submit event', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    await fixture.whenStable();

    expect(mockBookApiClient.updateBook).toHaveBeenCalled();
  });

  it('should navigate back to book detail', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.goBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/books', '1']);
  });

  it('should verify toast service called exactly once on success', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.onSubmit();

    await fixture.whenStable();

    expect(mockToastService.show).toHaveBeenCalledTimes(1);
    expect(mockToastService.show).toHaveBeenCalledWith('Book updated successfully!');
  });

  it('should not submit when book is null', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.book = null;

    component.onSubmit();

    expect(mockBookApiClient.updateBook).not.toHaveBeenCalled();
    expect(mockToastService.show).not.toHaveBeenCalled();
  });
});
