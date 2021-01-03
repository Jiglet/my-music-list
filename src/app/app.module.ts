import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

//Routing Imports
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { JwtInterceptor } from './core/jwt.interceptor';
import { ErrorInterceptor } from './core/error.interceptor';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { AlertComponent } from './components/alert/alert.component';
import { HeaderComponent } from './core/header/header.component';
import { SongsComponent } from './features/songs/songs.component';
import { MyListComponent } from './features/my-list/my-list.component';
import { SongDetailComponent } from './features/song-detail/song-detail.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { AlbumDetailComponent } from './features/album-detail/album-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    SongsComponent,
    MyListComponent,
    SongDetailComponent,
    AlbumDetailComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    RatingModule.forRoot(),
    RouterModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
