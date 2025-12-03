import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { CustomizerSettingsService } from './customizer-settings/customizer-settings.service';
import { ToggleService } from './common/header/toggle.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'CampusHire';

  constructor(
    public themeService: CustomizerSettingsService,
    public toggleService: ToggleService
  ) {}
}