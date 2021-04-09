import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { authService } from './auth.service';

@Injectable()

export class authGuard implements CanActivate {
  constructor(private authService: authService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuthenticated = this.authService.getIsAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
    }

    return isAuthenticated;
  }
}
