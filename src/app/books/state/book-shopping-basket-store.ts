import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods } from '@ngrx/signals';
import { addEntity, removeEntity, withEntities } from '@ngrx/signals/entities';

export type LineItem = { id: string; title: string; price: number };

export const BookShoppingBasketStore = signalStore(
  { providedIn: 'root' },
  withEntities<LineItem>(),
  withComputed(store => ({
    hasLineItems: computed(() => store.ids().length > 0),
    total: computed(() => store.entities().reduce((total, lineItem) => total + lineItem.price, 0))
  })),
  withMethods(store => ({
    addLineItem: (lineItem: LineItem) => patchState(store, addEntity(lineItem)),
    removeLineItem: (lineItem: LineItem) => patchState(store, removeEntity(lineItem.id))
  }))
);
