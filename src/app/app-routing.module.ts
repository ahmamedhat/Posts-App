import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { postListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  {path: '' , component: postListComponent},
  {path: 'create' , component: PostCreateComponent , canActivate: [authGuard]},
  {path: 'edit/:postId' , component: PostCreateComponent, canActivate: [authGuard]},
  {path: 'login' , component: LoginComponent},
  {path: 'signup' , component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [authGuard]
})
export class AppRoutingModule { }
