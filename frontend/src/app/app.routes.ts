import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard/myhome', pathMatch: 'full' },
  {
    path: 'access-denied',
    loadComponent: () => import('./access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: 'analytics',
        loadComponent: () => import('./dashboard/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      {
        path: 'myhome',
        loadComponent: () => import('./dashboard/myhome/college-card.component').then(m => m.CollegeCardComponent)
      }
    ]
  },
  {
    path: 'contacts',
    canActivate: [authGuard],
    loadComponent: () => import('./apps/contacts/contacts.component').then(m => m.ContactsComponent)
  },
  {
    path: 'users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'staff'] },
    loadComponent: () => import('./users/users')
      .then(m => m.UsersComponent)
  },

  {
    path: 'colleges',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'staff'] },
    loadComponent: () => import('./college-list/college-list.component')
      .then(m => m.CollegeListComponent)
  },

  {
    path: 'colleges/new',
    canActivate: [authGuard],
    loadComponent: () => import('./college-list/college-dialog/college-dialog.component')
      .then(m => m.CollegeDialogComponent)
  },

  {
    path: 'colleges/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./college-list/college-dialog/college-dialog.component')
      .then(m => m.CollegeDialogComponent)
  },

  {
    path: 'students',
    canActivate: [authGuard],
    loadComponent: () => import('./student-list/student-list.component')
      .then(m => m.StudentListComponent)
  },

  {
    path: 'companies',
    canActivate: [authGuard],
    loadComponent: () => import('./company-list/company-list')
      .then(m => m.CompanyListComponent)
  },

  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.routes').then(m => m.routes)
  },
  { path: '**', redirectTo: 'dashboard/myhome' }
];