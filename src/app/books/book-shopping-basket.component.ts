import { Component, inject } from '@angular/core';
import { BookShoppingBasketStore } from './state/book-shopping-basket-store';

@Component({
  selector: 'app-book-shopping-basket',
  template: `
    <ul>
      @for (lineItem of store.entities(); track lineItem.id) {
        <li class="p-1">
          {{ lineItem.title }} - {{ lineItem.price }}
          <button
            (click)="store.removeLineItem(lineItem)"
            class="text-center px-4 py-2 text-red-400 border border-red-400 rounded hover:bg-blue-50 transition-colors"
          >
            Remove
          </button>
        </li>
      }
    </ul>

    <strong>Total: {{ store.total() }}</strong>
  `
})
export class BookShoppingBasketComponent {
  protected store = inject(BookShoppingBasketStore);
}
