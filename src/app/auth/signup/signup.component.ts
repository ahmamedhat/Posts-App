import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { user } from '../auth.model';
import { authService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService: authService , private router: Router) { }

  isLoading = false;

  ngOnInit(): void {
  }

  onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const user: user = {...form.value};
    this.authService.onSignup(user);
    this.router.navigate(['/']);
  }

}
