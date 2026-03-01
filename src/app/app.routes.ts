import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'todos',
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./features/todos/pages/todo-page.component').then(
        (m) => m.TodoPageComponent,
      ),
  },
  {
    path: 'learn',
    loadComponent: () =>
      import('./features/learn/learn-page.component').then(
        (m) => m.LearnPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'todos',
  },
];
