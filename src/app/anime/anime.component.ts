import { Component, OnInit } from '@angular/core';
import KitsuApi from 'kitsu-json-api';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.css']
})
export class AnimeComponent implements OnInit {
  anime: any[];

  constructor(private _kitsuApi: KitsuApi) { }

  ngOnInit() {
    this.anime = this._kitsuApi.query('anime');
    console.log(this.anime);


  }

}
