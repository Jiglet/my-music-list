import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SongsService } from 'src/app/services/songs.service';
import { Song } from '../../models/song'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.css']
})
export class SongDetailComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private songsService: SongsService) { }
  myForm: FormGroup; 
  song: Song;
  details = []

  rate;
  curRating;
  hovered = 0;

  ngOnInit(): void {
    // Init FormGroup instance
    this.myForm = new FormGroup({          
      'name':new FormControl(null), //note, can have up to 3 Constructor Params: default value, validators, AsyncValidators
      'email':new FormControl(null,Validators.email)
    })

    console.log('trackId: '+this.route.snapshot.url[1])
    let spotifyID = this.route.snapshot.url[1]
    forkJoin([this.songsService.getTrack(spotifyID), this.songsService.getTrackReviews(spotifyID)]).subscribe(([songData, reviewData]) => {
      let rating = null
      let likes = reviewData['likes']
      console.log('reviewData:' +JSON.stringify(reviewData));

      this.song = { 
        id: songData['data']['id'], 
        name: songData['data']['name'],
        artists: songData['data']['artists'].map(x => x['name']),
        album: songData['data']['album']['name'],
        release_date: songData['data']['album']['release_date'],
        smImage: songData['data']['album']['images']['0']['url'],
        medImage: songData['data']['album']['images']['1']['url'],
        lgImage: songData['data']['album']['images']['2']['url'],
        likes: reviewData['likes'],
        rating: reviewData['rating'],
        ratings: reviewData['ratings'],
        reviews: reviewData['reviews'],
      }
      console.log(JSON.stringify(this.song,null,2));
    },
    error => {

    });
  }

  submitReview(): void {
    
  }

}
