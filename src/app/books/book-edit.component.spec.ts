import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { BookEditComponent } from './book-edit.component';
import { BookApiClient } from './book-api-client.service';
import { ToastService } from '../shared/toast.service';
import { Book } from './book';

function createMockBook(overrides?: Partial<Book>): Book {
  return {
    id: '1',
    isbn: '123456',
    title: 'Test Book',
    subtitle: 'A subtitle',
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

describe('BookEditComponent - Form Validation', () => {
  let component: BookEditComponent;
  let fixture: ComponentFixture<BookEditComponent>;
  let mockBookApiClient: any;
  let mockActivatedRoute: any;
  let mockToastService: any;

  beforeEach(async () => {
    mockBookApiClient = {
      getBookById: vi.fn().mockReturnValue(of(createMockBook())),
      updateBook: vi.fn().mockReturnValue(of(createMockBook()))
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('1')
        }
      }
    };

    mockToastService = {
      show: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BookEditComponent],
      providers: [
        provideRouter([]),
        { provide: BookApiClient, useValue: mockBookApiClient },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
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
