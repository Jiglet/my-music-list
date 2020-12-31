import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor(private router: Router,
    private http: HttpClient) { }

  getTop50() {
    console.log('getTop50 called')
    return this.http.get(`${environment.apiUrl}/spotify/getTop50`);
  }
}
