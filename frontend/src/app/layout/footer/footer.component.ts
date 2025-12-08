import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule],
  template: `
    <mat-toolbar class="footer">
      <span>&copy; 2024 CampusHire. All rights reserved.</span>
    </mat-toolbar>
  `,
  styles: [`
    .footer {
      font-size: 12px;
      justify-content: center;
      height: 40px;
      background: #f5f5f5;
      color: #666;
    }
  `]
})
export class FooterComponent {}
