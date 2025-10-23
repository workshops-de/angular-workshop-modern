import { TestBed } from '@angular/core/testing';
import { BookItemComponent } from './book-item.component';

describe('<app-book-item>', () => {
  describe('unit', () => {
    describe('When no content is passed', () => {
      it('defaults to "n/a"', () => {
        TestBed.runInInjectionContext(() => {
          const component = new BookItemComponent();

          const na = 'n/a';

          const content = component.book();

          expect(content.title).toBe(na);
          expect(content.subtitle).toBe(na);
          expect(content.author).toBe(na);
        });
      });
    });
  });
});
