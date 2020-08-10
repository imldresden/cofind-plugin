import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ModifyService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000';

  /**
   * fetch groups from server
   * uses http request
   * @returns {Observable<Object>}
   */
  getGroups() {
    return this
      .http
      .get(`${this.url}/groups/`);
  }
}
