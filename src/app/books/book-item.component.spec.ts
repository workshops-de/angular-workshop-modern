import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BookItemComponent } from './book-item.component';
import { createMockBook } from '../../test-utils/book.factory';

describe('BookItemComponent', () => {
  let component: BookItemComponent;
  let fixture: ComponentFixture<BookItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookItemComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(BookItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should display book information', () => {
    const mockBook = createMockBook();
    component.book = mockBook;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Test Book');
    expect(compiled.textContent).toContain('Test Author');
    expect(compiled.textContent).toContain('123456');
  });

  it('should handle book without cover image', () => {
    const mockBook = createMockBook({ cover: '' });
    component.book = mockBook;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');

    expect(img).toBeNull();
    expect(compiled.textContent).toContain('No cover available');
  });

  it('should handle book without subtitle', () => {
    const mockBook = createMockBook({ subtitle: undefined });
    component.book = mockBook;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent || '';
    expect(text).not.toContain('undefined');
  });

  it('should have correct router links', () => {
    const mockBook = createMockBook({ id: '123' });
    component.book = mockBook;
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a');
    const detailLink = Array.from(links).find(
      (link: any) => link.getAttribute('href')?.includes('/books/123') && !link.getAttribute('href')?.includes('/edit')
    );
    const editLink = Array.from(links).find((link: any) => link.getAttribute('href')?.includes('/books/123/edit'));

    expect(detailLink).toBeDefined();
    expect(editLink).toBeDefined();
  });

  it('should display all book properties correctly', () => {
    const mockBook = createMockBook({
      title: 'Angular Deep Dive',
      author: 'Jane Smith',
      isbn: '978-1234567890',
      subtitle: 'Master Angular Testing'
    });
    component.book = mockBook;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Angular Deep Dive');
    expect(compiled.textContent).toContain('Jane Smith');
    expect(compiled.textContent).toContain('978-1234567890');
    expect(compiled.textContent).toContain('Master Angular Testing');
  });

  it('should display cover image when available', () => {
    const mockBook = createMockBook({ cover: 'https://example.com/book-cover.jpg' });
    component.book = mockBook;
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe('https://example.com/book-cover.jpg');
    expect(img?.getAttribute('alt')).toBe('Test Book');
  });
});
