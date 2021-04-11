import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { user } from './auth.model';

@Injectable({ providedIn: 'root' })
export class authService {
  constructor(private http: HttpClient, private router: Router) {}

  private token: string;
  private isAuthenticatedListener = new Subject<boolean>();
  private isAuthenticated: boolean;
  private tokenTimer: any;
  private userId: string;

  onLogin(userData: user) {
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/user/login',
        userData
      )
      .subscribe(
        (response) => {
          this.token = response.token;
          if (this.token) {
            this.setExpirationDate(response.expiresIn);
            this.userId = response.userId;
            const now = new Date();
            this.saveAuthentication(
              this.token,
              new Date(now.getTime() + response.expiresIn),
              this.userId
            );
            this.isAuthenticatedListener.next(true);
            this.isAuthenticated = true;
          }
        },
        (error) => {
          this.isAuthenticatedListener.next(false);
        }
      );
  }

  onSignup(userData: user) {
    this.http.post('http://localhost:3000/api/user/signup', userData).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        this.isAuthenticatedListener.next(false);
      }
    );
  }

  onLogout() {
    this.token = null;
    this.isAuthenticated = false;
    this.isAuthenticatedListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  setExpirationDate(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.onLogout();
    }, duration);
  }

  getToken() {
    return this.token;
  }

  getAuthenticationStatus() {
    return this.isAuthenticatedListener.asObservable();
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  saveAuthentication(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', userId);
    localStorage.setItem('expires', expirationDate.toISOString());
  }

  getAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const authenticationInfo = {
      token: localStorage.getItem('token'),
      expires: new Date(localStorage.getItem('expires')),
      userId: localStorage.getItem('user'),
    };
    return authenticationInfo;
  }

  autoAuthentication() {
    const authenticationInfo = this.getAuthentication();
    if (!authenticationInfo) {
      return;
    }
    const now = new Date();
    const isAvailable = authenticationInfo.expires.getTime() - now.getTime();
    if (isAvailable > 0) {
      this.setExpirationDate(isAvailable);
      this.token = authenticationInfo.token;
      this.isAuthenticated = true;
      this.userId = authenticationInfo.userId;
      this.isAuthenticatedListener.next(true);
    }
  }

  clearAuthData() {
    localStorage.clear();
  }

  getUserId() {
    return this.userId;
  }
}
