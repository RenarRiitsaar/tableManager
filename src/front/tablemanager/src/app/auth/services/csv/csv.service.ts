import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


const API_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private http:HttpClient) { }

  exportCSV(tableId:number): Observable<any>{
    const options = {
      responseType: 'text' as 'json',
      headers: this.authHeader() 
  };
    return this.http.get(API_URL + `/api/csv/${tableId}/export`, options);
  }

  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}