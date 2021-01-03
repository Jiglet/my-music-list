import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SongsService } from 'src/app/services/songs.service';
import { Song } from '../../models/song'
import { Album } from '../../models/album'
import { User } from 'src/app/models/user';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private songsService: SongsService, private accountService: AccountService) { }
  reviewForm: FormGroup; 
  album: Album;
  details = [];
  userReviews = [];
  tracks = [];

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

    // Get album data
    let spotifyID = this.route.snapshot.url[1]
    forkJoin([this.songsService.getAlbum(spotifyID), this.songsService.getAlbumReviews({id: spotifyID.path})]).subscribe(([albumData, reviewData]) => {
      let album = albumData['data'];
      console.log('albumData:' +JSON.stringify(albumData, null, 2));
      console.log('reviewData:' +JSON.stringify(reviewData, null, 2));
      this.album = { 
        id: album['id'], 
        name: album['name'],
        type: album['type'],
        artists: album['artists'].map(x => x['name']),
        tracks: album['total_tracks'],
        release_date: album['release_date'],
        smImage: album['images']['0']['url'],
        medImage: album['images']['1']['url'],
        lgImage: album['images']['2']['url'],
        likes: reviewData['likes'],
        rating: (Math.round(reviewData['rating'] * 100) / 100).toFixed(2).toString(),
        ratings: reviewData['ratings'],
        reviews: reviewData['reviews'],
      }
      this.tracks = album['tracks']['items'];
      console.log(JSON.stringify(this.album,null,2));
      this.userReviews = reviewData['userReviews']
      console.log('this.reviews: '+JSON.stringify(this.userReviews))
    },
    error => {
      throw error
    });

    // Get user data
    let user = JSON.parse(this.accountService.getUser());
    let request = { userID: user['id'], spotifyID: this.route.snapshot.url[1].path }
    this.songsService.getUserAlbumData(request).subscribe(data => {
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

  submitAlbumRating(rate): void {
    // Get user data to send in request
    let user = JSON.parse(this.accountService.getUser());
    let request = {
      type: 'album',
      userID: user['id'],
      username: user['username'],
      spotifyID: this.route.snapshot.url[1].path,
      rating: rate
    }

    // If user already rated, send edit request, otherwise send submit
    if (this.rated) {
      this.songsService.editAlbumRating(request).subscribe(data => {
        if(data['success']) {
          this.ratingStatus = 'Rating updated!';
          this.rated = true;
          window.location.reload();
        } else {
          this.ratingStatus = 'Something went wrong';
        }
      })
    } else {
      this.songsService.submitAlbumRating(request).subscribe(data => {
        if(data['success']) {
          this.ratingStatus = 'Thanks for rating!';
          this.rated = true;
          window.location.reload();
        } else {
          this.ratingStatus = 'Something went wrong';
        }
      })
    }
  }

  submitAlbumReview(): void {
    let user = JSON.parse(this.accountService.getUser());
    let rating = this.reviewForm.get('rating').value
    let reviewContent = this.reviewForm.get('reviewContent').value

    let request = {
      type: 'album',
      userID: user["id"],
      username: user['username'],
      spotifyID: this.route.snapshot.url[1].path,
      rating: rating,
      reviewContent: reviewContent
    }

    this.songsService.submitAlbumReview(request).subscribe(data => {
      if(data['success']) {
        this.ratingStatus = 'Thanks for reviewing!';
        this.rated = true;
        window.location.reload();
      } else {
        this.ratingStatus = 'Something went wrong';
      }
    })

    this.rate = rating
  }

}
