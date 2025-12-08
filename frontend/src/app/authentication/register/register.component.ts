import { Component, NgZone } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

    hide = true;
    registerForm: FormGroup;
    error: string = '';

    constructor(
        public themeService: CustomizerSettingsService,
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private ngZone: NgZone
    ) {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validator: this.checkPasswords });
    }

    checkPasswords(group: FormGroup) {
        const pass = group.get('password')?.value;
        const confirmPass = group.get('confirmPassword')?.value;
        return pass === confirmPass ? null : { notSame: true };
    }

    onSubmit() {
        console.log('Form Status:', this.registerForm.status);
        if (this.registerForm.valid) {
            const { confirmPassword, ...userData } = this.registerForm.value;
            console.log('Sending registration request...');
            this.authService.register(userData).subscribe({
                next: (res) => {
                    console.log('Registration successful:', res);
                    this.ngZone.run(() => {
                        this.router.navigate(['/authentication/login']).then(success => {
                            if (success) {
                                console.log('Navigation to login successful');
                            } else {
                                console.error('Navigation to login failed');
                                this.error = 'Registration successful, but navigation failed. Please go to Login page manually.';
                            }
                        });
                    });
                },
                error: (err) => {
                    console.error('Registration error:', err);
                    this.error = err.error?.message || 'Registration failed. User might already exist.';
                }
            });
        } else {
            console.log('Form is invalid');
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