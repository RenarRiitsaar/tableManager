import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class Base64Service {

  private BASIC_URL = environment.serverUrl

  constructor(private http: HttpClient) { }

  getBase64Image(): Observable<string>{
    return this.http.get<string>(this.BASIC_URL + '/api/pdf/base64', {
      headers:this.authHeader(), responseType:'text' as 'json'
    }).pipe(
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }

  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
