import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
        <mat-icon matListItemIcon>dashboard</mat-icon>
        <span matListItemTitle *ngIf="!collapsed">Dashboard</span>
      </a>
      <a mat-list-item routerLink="/colleges" routerLinkActive="active">
        <mat-icon matListItemIcon>school</mat-icon>
        <span matListItemTitle *ngIf="!collapsed">Colleges</span>
      </a>
       <a mat-list-item routerLink="/users" routerLinkActive="active" *ngIf="canViewUsers">
        <mat-icon matListItemIcon>people</mat-icon>
        <span matListItemTitle *ngIf="!collapsed">Users</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    .active {
      background-color: rgba(0, 0, 0, 0.05);
      color: #1976d2;
    }
    :host {
      display: block;
      overflow: hidden;
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;

  constructor(public authService: AuthService) { }

  get canViewUsers(): boolean {
    return this.authService.hasRole(['admin']);
  }
}
