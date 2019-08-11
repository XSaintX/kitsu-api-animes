import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KitsuService {

  public apiUrl: any = 'https://kitsu.io';

  constructor(public http: HttpClient) { }

  public headers = new HttpHeaders({
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',  // u used comma
  });

  /*fetch('https://kitsu.io/api/edge/anime', {
    headers: {
        Accept: application/vnd.api+json,
 Content-Type: application/vnd.api+json
}}).then(res => console.log(res)) */

  getAnimes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/edge/anime`
      , { headers: this.headers });
  }

  findAnimesbyText(text: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/edge/anime?filter[text]=` + text
      , { headers: this.headers });
  }
  findAnimesbyGender(gender: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/edge/anime?filter[genres]=` + gender
      , { headers: this.headers });
  }
  paginate(limit: number, offset: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/edge/anime?page[limit]=` + limit + `&page[offset]=` + offset
      , { headers: this.headers });
  }
}
