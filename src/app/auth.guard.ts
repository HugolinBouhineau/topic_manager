import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

export const AuthGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if(!auth.isConnected()) {
        router.navigateByUrl('/login')
        return false
    }
    return true
}

export const LogGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isConnected()) {
    router.navigateByUrl('/home');
    return false;
  }
  return true;
}
