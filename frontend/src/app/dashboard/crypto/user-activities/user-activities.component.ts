import { Component } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-user-activities',
    imports: [MatCardModule, MatMenuModule, MatButtonModule],
    templateUrl: './user-activities.component.html',
    styleUrls: ['./user-activities.component.scss']
})
export class UserActivitiesComponent {

    constructor(
        public themeService: CustomizerSettingsService
    ) {}

    toggleTheme() {
        this.themeService.toggleTheme();
    }

}