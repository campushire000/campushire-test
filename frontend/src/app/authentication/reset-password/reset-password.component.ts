import { Component, ChangeDetectorRef } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { RouterLink, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [RouterLink, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, CommonModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

    hide = true;
    resetPasswordForm: FormGroup;
    message: string = '';
    error: string = '';

    constructor(
        public themeService: CustomizerSettingsService,
        private fb: FormBuilder,
        private authService: AuthService,
        private cdr: ChangeDetectorRef,
        private router: Router
    ) {
        this.resetPasswordForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.resetPasswordForm.valid) {
            this.authService.resetPassword(this.resetPasswordForm.value.password).subscribe({
                next: (res: any) => {
                    this.message = 'Password updated successfully. Redirecting to login...';
                    this.error = '';
                    this.resetPasswordForm.reset();
                    this.cdr.detectChanges();
                    setTimeout(() => {
                        this.authService.logout(); // Clear session
                        this.router.navigate(['/authentication/login']);
                    }, 2000);
                },
                error: (err: any) => {
                    this.error = err.error?.message || 'Failed to update password.';
                    this.message = '';
                    this.cdr.detectChanges();
                }
            });
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