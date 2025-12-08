import { Component } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-listbox',
    imports: [MatCardModule],
    templateUrl: './listbox.component.html',
    styleUrls: ['./listbox.component.scss']
})
export class ListboxComponent {

    sizes = ['XS', 'S', 'M', 'L', 'XL'];

    constructor(
        public themeService: CustomizerSettingsService
    ) {}

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}