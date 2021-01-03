import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './features/home/home.component'
import { LoginComponent } from './account/login/login.component'
import { RegisterComponent } from './account/register/register.component'
import { AuthGuard } from './core/auth.guard';
import { SongsComponent } from './features/songs/songs.component';
import { SongDetailComponent } from './features/song-detail/song-detail.component';
import { AlbumDetailComponent } from './features/album-detail/album-detail.component';
import { MyListComponent } from './features/my-list/my-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'songs', component: SongsComponent },
  { path: 'myList', component: MyListComponent },
  { path: 'track/:id', component: SongDetailComponent },
  { path: 'album/:id', component: AlbumDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [HomeComponent, LoginComponent]