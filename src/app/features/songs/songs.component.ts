import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SongsService } from 'src/app/services/songs.service';
import { Song } from '../../models/song'

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {

  constructor(private router: Router, private songsService: SongsService) { }

  songs: Song[] = []

  ngOnInit(): void {
    this.songsService.getUSTop50().subscribe(data => {
      let temp = data['data']['tracks']['items']

      // Parsing the JSON data into songs
      this.songs = temp.map(track => { 
        //console.log('track: '+JSON.stringify(track,null,2))
        let newSong: Song = { 
          id: track['track']['id'], 
          name: track['track']['name'],
          artists: track['track']['artists'].map(x => x['name']),
          album: track['track']['album']['name'],
          release_date: track['track']['album']['release_date'],
          smImage: track['track']['album']['images']['0']['url'],
          medImage: track['track']['album']['images']['1']['url'],
          lgImage: track['track']['album']['images']['2']['url']
        }  
        return newSong
      })
      //console.log('songs: '+JSON.stringify(this.songs,null,2))
    },
      error => {

      });
  }
}
