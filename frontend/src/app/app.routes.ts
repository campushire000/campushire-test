// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard/analytics', pathMatch: 'full' },
  {
      path: 'dashboard',
      children: [
          {
              path: 'analytics',
              loadComponent: () => import('./dashboard/analytics/analytics.component').then(m => m.AnalyticsComponent)
          }
      ]
  },
  {
    path: 'contacts',
    loadComponent: () => import('./apps/contacts/contacts.component').then(m => m.ContactsComponent)
  },
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

  { path: '**', redirectTo: 'dashboard/analytics' }
];