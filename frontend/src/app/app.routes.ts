// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'colleges', pathMatch: 'full' },

  // THIS WAS YOUR PROBLEM — WRONG PATH!
   {
    path: 'users',
    loadComponent: () => import('./users/users')
      .then(m => m.UsersComponent)
  },

  {
    path: 'colleges',
    loadComponent: () => import('./college-list/college-list.component')
      .then(m => m.CollegeListComponent)
  },

  {
    path: 'colleges/new',
    loadComponent: () => import('./college/college')
      .then(m => m.CollegeFormComponent)
  },

  {
    path: 'colleges/edit/:id',
    loadComponent: () => import('./college/college')
      .then(m => m.CollegeFormComponent)
  },

  { path: '**', redirectTo: 'colleges' }
];