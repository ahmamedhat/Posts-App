import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { headerComponent } from './header/header.component';
import { postListComponent } from './posts/post-list/post-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authInterceptor } from './auth/auth-interceptor';
import { errorInterceptor } from './error-interceptor';
import { errorComponent } from './error/error.component';
import { angularMaterialModule } from './angular-material.module';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    headerComponent,
    postListComponent,
    LoginComponent,
    SignupComponent,
    errorComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    angularMaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: authInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: errorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],

})
export class AppModule {}
