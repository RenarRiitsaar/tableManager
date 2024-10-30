import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../../environments/environment';

const API_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class TableService {


  constructor(private http: HttpClient) { }

  createTable(table: any): Observable<any> {
    return this.http.post(API_URL + '/api/tables' , table,
      {headers: this.authHeader()});
  }
  getAllTables(): Observable<any[]>{
    return this.http.get<any[]>(API_URL + '/api/tables',
      {headers: this.authHeader()});
  }

  getTableById(tableId: number):Observable<any>{
    return this.http.get(API_URL + `/api/tables/${tableId}`,
      {headers: this.authHeader()});
  }

  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}