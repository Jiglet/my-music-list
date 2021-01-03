import { Component, OnInit } from '@angular/core';
import { SongsService } from 'src/app/services/songs.service';
import { Album } from '../../models/album'
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private songsService: SongsService) { }

  albums: Album[] = []

  ngOnInit(): void {
    this.songsService.getNewReleases().subscribe(data => {
      console.log('data: '+JSON.stringify(data.data.albums.items, null, 2))
      let temp = data.data.albums.items;

      this.albums = temp.map(track => { 
        //console.log('track: '+JSON.stringify(track,null,2))
        let album: Album = { 
          id: track['id'], 
          name: track['name'],
          artists: track['artists'].map(x => x['name']),
          tracks: track['total_tracks'],
          release_date: track['release_date'],
          smImage: track['images']['0']['url'],
          medImage: track['images']['1']['url'],
          lgImage: track['images']['2']['url'],
          likes: 0,
          rating: 'N/A',
          ratings: 0,
          reviews: 0,
        }  
        return album
      })

      console.log('data: '+JSON.stringify(this.albums, null, 2))
    });
  }

}
