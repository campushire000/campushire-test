import { Component } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DrawerEbsComponent } from './drawer-ebs/drawer-ebs.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-sidenav',
    imports: [MatCardModule, MatSidenavModule, DrawerEbsComponent, MatButtonModule],
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

    constructor(
        public themeService: CustomizerSettingsService
    ) {}

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    showFiller = false;

}