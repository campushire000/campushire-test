import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';
import { map, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Get expected roles from route data
    const expectedRoles = route.data['roles'] as string | string[];

    if (!expectedRoles) {
        // If no roles defined, allow access (or deny? usually allow if guard is not explicitly checking something else)
        // But if roleGuard is added, we expect roles to be present. 
        // Let's assume if added but no data, it's a configuration error -> deny to be safe? 
        // Or maybe just return true. Let's return true but warn.
        console.warn('RoleGuard attached but no roles defined in route data.');
        return true;
    }

    return authService.isLoggedIn$.pipe(
        take(1),
        map(isLoggedIn => {
            if (!isLoggedIn) {
                return router.createUrlTree(['/authentication/login']);
            }

            if (authService.hasRole(expectedRoles)) {
                return true;
            } else {
                // User is logged in but doesn't have role
                // Redirect to dashboard or forbidden page
                // For now, redirect to dashboard or stay put?
                // Let's redirect to dashboard if they try to access something unauthorized.
                // Or create a dummy '/unauthorized' page. 
                // Let's stick to simple redirect to root/dashboard.
                return router.createUrlTree(['/access-denied']);
            }
        })
    );
};
