import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


const API_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class RowService {

  constructor(private http: HttpClient) { }

  addRow(tableId:number): Observable<any>{
    return this.http.post(API_URL + `/api/tables/${tableId}/rows`,{},
      {headers: this.authHeader()});
  }

  deleteRow(tableId: number, rowId: number):Observable<any>{
    return this.http.delete(API_URL + `/api/tables/${tableId}/rows/${rowId}`,
      {headers: this.authHeader()});
  }
  
  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}