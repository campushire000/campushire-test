import { Component } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-ecommerce-impressions',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './ecommerce-impressions.component.html',
    styleUrls: ['./ecommerce-impressions.component.scss']
})
export class EcommerceImpressionsComponent {

    constructor(
        public themeService: CustomizerSettingsService
    ) {}

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}