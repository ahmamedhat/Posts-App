import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { authService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class headerComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean;
  isAuthenticatedSub: Subscription;

  constructor(private authService: authService , private router: Router) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.isAuthenticatedSub = this.authService
      .getAuthenticationStatus()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.onLogout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.isAuthenticatedSub.unsubscribe();
  }
}
