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
    console.log('test')
    this.songsService.getTop50().subscribe(data => {
      //console.log('data: '+JSON.stringify(data['data'], null, 2));
      this.songs = data['data']['tracks']['items']
      console.log('SONGS: '+ JSON.stringify(this.songs, null, 2));
      console.log(this.songs[0]['track']['album']['images']['1']['url'])
    },
      error => {

      });
  }

}
