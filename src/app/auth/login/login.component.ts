import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { user } from '../auth.model';
import { authService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: authService , private router:Router) { }

  isLoading = false;

  ngOnInit(): void {
  }

  onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const userData: user = {...form.value};
    this.authService.onLogin(userData);
    this.router.navigate(['/']);
  }
}
