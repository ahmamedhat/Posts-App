import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { user } from '../auth.model';
import { authService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit , OnDestroy {

  constructor(private authService: authService , private router:Router) { }

  isLoading = false;
  isAuthenticated: boolean;
  isAuthenticatedSub: Subscription;

  ngOnInit(): void {
    this.isAuthenticatedSub = this.authService.getAuthenticationStatus().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    })
  }

  onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const userData: user = {...form.value};
    this.authService.onLogin(userData);
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.isAuthenticatedSub.unsubscribe();
  }
}
