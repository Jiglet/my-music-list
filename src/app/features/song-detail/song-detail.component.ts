import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongsService } from 'src/app/services/songs.service';
import { Song } from '../../models/song'

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.css']
})
export class SongDetailComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private songsService: SongsService) { }
  song: Song;
  rate;
  curRating;

  ngOnInit(): void {
    console.log('trackId: '+this.route.snapshot.url[1])
    this.songsService.getTrack(this.route.snapshot.url[1]).subscribe(data => {
      console.log(JSON.stringify(data,null,2));
      this.song = { 
        id: data['data']['id'], 
        name: data['data']['name'],
        artists: data['data']['artists'].map(x => x['name']),
        album: data['data']['album']['name'],
        release_date: data['data']['album']['release_date'],
        smImage: data['data']['album']['images']['0']['url'],
        medImage: data['data']['album']['images']['1']['url'],
        lgImage: data['data']['album']['images']['2']['url']
      }
      console.log(JSON.stringify(this.song,null,2));
    },
    error => {

    });
  }

}
