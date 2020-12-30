import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './features/home/home.component'
import { LoginComponent } from './account/login/login.component'
import { RegisterComponent } from './account/register/register.component'
import { AuthGuard } from './core/auth.guard';
import { SongsComponent } from './features/songs/songs.component';
import { MyListComponent } from './features/my-list/my-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'songs', component: SongsComponent },
  { path: 'myList', component: MyListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [HomeComponent, LoginComponent]