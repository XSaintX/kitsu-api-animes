import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../shared/anime.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  constructor(private _animeservice: AnimeService) { }

  ngOnInit() {
    this._animeservice.selectedAnime = {
      ageRating: '',
      ageRatingGuide: '',
      averageRating: '',
      canonicalTitle: '',
      coverImageTopOffset: '',
      createdAt: '',
      endDate: '',
      episodeCount: '',
      episodeLength: '',
      favoritesCount: '',
      nsfw: '',
      popularityRank: '',
      ratingRank: '',
      showType: '',
      slug: '',
      startDate: '',
      status: '',
      subtype: '',
      synopsis: '',
      totalLength: '',
      updatedAt: '',
      userCount: '',
      youtubeVideoId: ''
      
    };
  }

}
