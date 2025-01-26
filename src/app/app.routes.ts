


import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./modules/auth/pages/forgot-password/forgot-password.page').then(
        (m) => m.ForgotPasswordPage
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./modules/home/pages/categories/categories.page').then(
        (m) => m.CategoriesPage
      ),
    canActivate: [authGuard],
  },
  {
    path: 'add-task',
    loadComponent: () =>
      import('./modules/home/pages/add-task/add-task.page').then(
        (m) => m.AddTaskPage
      ),
    canActivate: [authGuard],
  },
  {
    path: 'edit-task',
    loadComponent: () =>
      import('./modules/home/pages/edit-task/edit-task.page').then(
        (m) => m.EditTaskPage
      ),
    canActivate: [authGuard],
  },
];