import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../constants/app.constants';
import { HttpRequestOptions } from '../interfaces/httpRequestOptionsInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private http: HttpClient
  ) { }

  getCategories(): Observable<any> {
    return this.http.get(SERVER_API_URL + "/getCategories");
  }

  getClothesNoFilter(): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/getClothes", null, options);
  }

}
