import { Component, OnInit } from '@angular/core';
import { KitsuService } from './kitsu.service';
import { AnimeService } from '../shared/anime.service';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.css']
})
export class AnimeComponent implements OnInit {
  result: any;
  gendertext: string;
  titletext: string;
  limit: number = 10;
  offset: number = 0;
  enableanterior: boolean = false;
  arreglo: Array<{
    id: string,
    canonicalTitle: string,
    averageRating: string,
    startDate: string,
    endDate: string,
    status: string,
    posterImage: string
  }> = [];


  constructor(private _kitsu: KitsuService,
    private _animeservice: AnimeService
  ) { }

  ngOnInit() {
    this.titletext = '';
    this.gendertext = '';
    
    this.arreglo = [];
    this._kitsu.getAnimes().subscribe((x: any) => {
      this.result = x.data;
      //console.log(this.result);
      for (let obj of this.result) {

        this.arreglo.push({
          id: obj.id,
          canonicalTitle: obj.attributes['canonicalTitle'],
          averageRating: obj.attributes['averageRating'],
          startDate: obj.attributes['startDate'],
          endDate: obj.attributes['endDate'],
          status: obj.attributes['status'],
          posterImage: obj.attributes.posterImage.medium  
          


        });
      }
      
    });
  }

  searchbytext(title: string) {
    this.gendertext = '';
    this.arreglo = [];

    this._kitsu.findAnimesbyText(title).subscribe((x: any) => {
      this.result = x.data;
      for (let obj of this.result) {

        this.arreglo.push({
          id: obj.id,
          canonicalTitle: obj.attributes['canonicalTitle'],
          averageRating: obj.attributes['averageRating'],
          startDate: obj.attributes['startDate'],
          endDate: obj.attributes['endDate'],
          status: obj.attributes['status'],
          posterImage: obj.attributes.posterImage.medium
        }
        );
      }

    }
    );

  }

  searchbygender(gender: string) {

    this.titletext = '';
    this.arreglo = [];

    this._kitsu.findAnimesbyGender(gender).subscribe((x: any) => {
      this.result = x.data;
      for (let obj of this.result) {

        this.arreglo.push({
          id: obj.id,
          canonicalTitle: obj.attributes['canonicalTitle'],
          averageRating: obj.attributes['averageRating'],
          startDate: obj.attributes['startDate'],
          endDate: obj.attributes['endDate'],
          status: obj.attributes['status'],
          posterImage: obj.attributes.posterImage.medium
        }
        );
      }

    }
    );
  }

  detail(id: string) {

    //this._kitsu.getAnimes().subscribe((x: any) => {
    //this.result = x.data;
    for (let obj of this.result) {
      if (id == obj.id) {
        this._animeservice.selectedAnime = { //obj;
          ageRating: obj.attributes['ageRating'],
          ageRatingGuide: obj.attributes['ageRatingGuide'],
          averageRating: obj.attributes['averageRating'],
          canonicalTitle: obj.attributes['canonicalTitle'],
          coverImageTopOffset: obj.attributes['coverImageTopOffset'],
          createdAt: obj.attributes['createdAt'],
          endDate: obj.attributes['endDate'],
          episodeCount: obj.attributes['episodeCount'],
          episodeLength: obj.attributes['episodeLength'],
          favoritesCount: obj.attributes['favoritesCount'],
          nsfw: obj.attributes['nsfw'],
          popularityRank: obj.attributes['popularityRank'],
          ratingRank: obj.attributes['ratingRank'],
          showType: obj.attributes['showType'],
          slug: obj.attributes['slug'],
          startDate: obj.attributes['startDate'],
          status: obj.attributes['status'],
          subtype: obj.attributes['subtype'],
          synopsis: obj.attributes['synopsis'],
          totalLength: obj.attributes['totalLength'],
          updatedAt: obj.attributes['updatedAt'],
          userCount: obj.attributes['userCount'],
          youtubeVideoId: obj.attributes['youtubeVideoId']
        };
      }
    }

    //}
    //);
  }
  paginateAnterior() {
    this.arreglo = [];
    this.offset = this.offset - 10;
    console.log(this.offset);
    if (this.offset >= 0) {
      this._kitsu.paginate(this.limit, this.offset).subscribe((x: any) => {
        this.result = x.data;
        console.log(this.result);
        for (let obj of this.result) {
          this.arreglo.push({
            id: obj.id,
            canonicalTitle: obj.attributes['canonicalTitle'],
            averageRating: obj.attributes['averageRating'],
            startDate: obj.attributes['startDate'],
            endDate: obj.attributes['endDate'],
            status: obj.attributes['status'],
            posterImage: obj.attributes.posterImage.medium
          });
        }
      });
    }
    else {
      this.offset = -1;
    }
  }
  paginate() {
    this.arreglo = [];
    this.offset = this.offset == -1 ? 0 : this.offset + 10;
    this._kitsu.paginate(this.limit, this.offset).subscribe((x: any) => {
      this.result = x.data;
      console.log(this.result);
      for (let obj of this.result) {
        this.arreglo.push({
          id: obj.id,
          canonicalTitle: obj.attributes['canonicalTitle'],
          averageRating: obj.attributes['averageRating'],
          startDate: obj.attributes['startDate'],
          endDate: obj.attributes['endDate'],
          status: obj.attributes['status'],
          posterImage: obj.attributes.posterImage.medium
        });
      }
    });
  }

}
