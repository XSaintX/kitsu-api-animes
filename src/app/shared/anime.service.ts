import { Injectable } from '@angular/core';
import { Anime } from './anime.model';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  selectedAnime : Anime;//[]any;
  constructor() { }
}
