import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCheckboxModule, ReactiveFormsModule, CommonModule, MatSnackBarModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    hide = true;
    loginForm: FormGroup;
    error: string = '';

    constructor(
        public themeService: CustomizerSettingsService,
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private snackBar: MatSnackBar
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        // Check for token from social login redirect
        this.route.queryParams.subscribe(params => {
            if (params['token']) {
                const token = params['token'];
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const user = {
                        _id: payload.sub,
                        email: payload.email,
                        name: payload.name,
                        role: payload.role,
                        picture: null // Picture might not be in payload, we can safely omit or set null
                    };
                    this.authService.setSession({ access_token: token, user: user });
                    this.router.navigate(['/']); // Redirect to dashboard
                } catch (e) {
                    console.error('Error decoding token', e);
                    this.error = 'Authentication failed';
                }
            } else if (params['error']) {
                if (params['error'] === 'inactive') {
                    const message = 'Your account is inactive. Please contact the administrator.';
                    this.error = message;
                    this.snackBar.open(message, 'Close', {
                        duration: 5000,
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        panelClass: ['error-snackbar']
                    });
                } else {
                    this.error = 'Authentication failed';
                }
            }
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    let message = 'Invalid credentials';
                    if (err.error && err.error.message === 'User account is inactive') {
                        message = 'Your account is inactive. Please contact the administrator.';
                    }

                    this.error = message;
                    this.snackBar.open(message, 'Close', {
                        duration: 5000,
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        panelClass: ['error-snackbar'] // Optional, if you have styles, or just default
                    });

                    console.error(err);
                    this.cdr.detectChanges();
                }
            });
        }
    }

    loginWithGoogle() {
        window.location.href = `${environment.apiUrl}/auth/google`;
    }

    loginWithFacebook() {
        window.location.href = `${environment.apiUrl}/auth/facebook`;
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