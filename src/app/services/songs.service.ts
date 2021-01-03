import { Injectable } from '@angular/core';
import { Router, UrlSegment } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor(private router: Router, private http: HttpClient) { }
    // SPOTIFY API CALLS
    getTrack(id) {
      return this.http.post(`${environment.apiUrl}/spotify/getTrack`, id);
    }
    getAlbum(id) {
      return this.http.post(`${environment.apiUrl}/spotify/getAlbum`, id);
    }
    getUSTop50() {
      return this.http.get(`${environment.apiUrl}/spotify/getUSTop50`);
    }
    getNewReleases() {
      return this.http.get(`${environment.apiUrl}/spotify/getNewReleases`);
    }

    // REVIEWS API CALLS
    getTrackReviews(id) {
      return this.http.post(`${environment.apiUrl}/reviews/getTrackReviews`, id);
    }

    getAlbumReviews(id) {
      return this.http.post(`${environment.apiUrl}/reviews/getAlbumReviews`, id);
    }

    submitReview(request) {
      return this.http.post(`${environment.apiUrl}/reviews/submitReview`, request);
    }

    submitAlbumReview(request) {
      return this.http.post(`${environment.apiUrl}/reviews/submitAlbumReview`, request);
    }

    // RATING API CALLS
    submitRating(request) {
      return this.http.post(`${environment.apiUrl}/reviews/submitRating`, request);
    }

    editRating(request) {
      return this.http.post(`${environment.apiUrl}/reviews/editRating`, request);
    }

    submitAlbumRating(request) {
      return this.http.post(`${environment.apiUrl}/reviews/submitAlbumRating`, request);
    }

    editAlbumRating(request) {
      return this.http.post(`${environment.apiUrl}/reviews/editAlbumRating`, request);
    }

    // USER DATA API CALLS
    getUserSongData(userID) {
      console.log('usersongdata called')
      return this.http.post(`${environment.apiUrl}/reviews/getUserSongData`, userID);
    }
    getUserAlbumData(userID) {
      console.log('usersongdata called')
      return this.http.post(`${environment.apiUrl}/reviews/getUserAlbumData`, userID);
    }
}
