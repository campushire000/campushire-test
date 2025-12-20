import { Component } from "@angular/core";
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MatCardModule } from "@angular/material/card";




import { AuthService } from '../../../authentication/auth.service';

@Component({
    selector: 'app-welcome-dashboard',
    imports: [MatCardModule],
    templateUrl: './welcome-dashboard.component.html',
    styleUrls: ['./welcome-dashboard.component.scss']
})
export class WelcomeDashboardComponent {

    userPhoto: string | null = null;
    userName: string = 'User';

    constructor(
        public themeService: CustomizerSettingsService,
        private authService: AuthService
    ) {
        const user = this.authService.getUser();
        if (user) {
            this.userPhoto = user.picture || null;
            this.userName = user.name || 'User';
        }
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}