import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'books',
    renderMode: RenderMode.Server
  },
  {
    path: 'books/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'books/:id/edit',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
