import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SongsService } from 'src/app/services/songs.service';
import { Song } from '../../models/song'
import { User } from 'src/app/models/user';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.css']
})
export class SongDetailComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private songsService: SongsService, private accountService: AccountService) { }
  reviewForm: FormGroup; 
  song: Song;
  details = [];
  userReviews = [];

  rated: Boolean;
  rate = 0;
  review = '';
  reviewedDate = '';
  ratingStatus = 'Not yet rated';
  

  ngOnInit(): void {
    // Init FormGroup instance
    this.reviewForm = new FormGroup({          
      'rating':new FormControl(null, Validators.required), 
      'reviewContent':new FormControl('', Validators.required)
    })

    // Get song data
    let spotifyID = this.route.snapshot.url[1]
    forkJoin([this.songsService.getTrack(spotifyID), this.songsService.getTrackReviews({id: spotifyID.path})]).subscribe(([songData, reviewData]) => {
      // console.log('reviewData:' +JSON.stringify(reviewData));
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
        rating: (Math.round(reviewData['rating'] * 100) / 100).toFixed(2).toString(),
        ratings: reviewData['ratings'],
        reviews: reviewData['reviews'],
      }
      console.log(JSON.stringify(this.song,null,2));
      this.userReviews = reviewData['userReviews']
      console.log('this.reviews: '+JSON.stringify(this.userReviews))
    },
    error => {
      throw error
    });

    // Get reviews for current song


    // Get user data
    let user = JSON.parse(this.accountService.getUser());
    let request = { userID: user['id'], spotifyID: this.route.snapshot.url[1].path }
    this.songsService.getUserSongData(request).subscribe(data => {
      console.log('DATA: '+JSON.stringify(data))
      if (data['rated']) {
        this.rate = data['rating']
        this.review = data['review']
        this.reviewedDate = data['date']
        this.ratingStatus = 'Thanks for rating!'
        this.rated = true
      } else { // User has not yet rated
        console.log('user hasnt rated yet')
      }
    })
  }

  submitRating(rate): void {
    // Get user data to send in request
    let user = JSON.parse(this.accountService.getUser());
    let request = {
      userID: user["id"],
      username: user['username'],
      spotifyID: this.route.snapshot.url[1].path,
      rating: rate
    }

    // If user already rated, send edit request, otherwise send submit
    if (this.rated) {
      this.songsService.editRating(request).subscribe(data => {
        if(data['success']) {
          this.ratingStatus = 'Rating updated!';
          this.rated = true;
        } else {
          this.ratingStatus = 'Something went wrong';
        }
      })
    } else {
      this.songsService.submitRating(request).subscribe(data => {
        if(data['success']) {
          this.ratingStatus = 'Thanks for rating!';
          this.rated = true;
        } else {
          this.ratingStatus = 'Something went wrong';
        }
      })
    }
  }

  submitReview(): void {
    let user = JSON.parse(this.accountService.getUser());
    let rating = this.reviewForm.get('rating').value
    let reviewContent = this.reviewForm.get('reviewContent').value

    let request = {
      userID: user["id"],
      username: user['username'],
      spotifyID: this.route.snapshot.url[1].path,
      rating: rating,
      reviewContent: reviewContent
    }

    this.songsService.submitReview(request).subscribe(data => {
      if(data['success']) {
        this.ratingStatus = 'Thanks for reviewing!';
        this.rated = true;
      } else {
        this.ratingStatus = 'Something went wrong';
      }
    })

    this.rate = rating
  }

}
