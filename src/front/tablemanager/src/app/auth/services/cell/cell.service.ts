import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../../environments/environment';
import { Cell } from '../../../model/Cell';


const API_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class CellService {

  constructor(private http: HttpClient) { }

  getCellById(cellId:number, rowId:number): Observable<Cell>{
    return this.http.get<Cell>(API_URL + `/api/tables/${rowId}/cells/${cellId}`,
      {headers: this.authHeader()});
  }

  addCell(tableId:number, cell:any):Observable<any>{
    return this.http.post(API_URL + `/api/tables/${tableId}/cells`, cell,
      {headers: this.authHeader()});
  }

  editCell(cellId:number, rowId:number, cellData: any): Observable<any>{
    return this.http.put(API_URL + `/api/tables/${rowId}/cells/${cellId}`, cellData,
      {headers: this.authHeader()});
  }

  deleteCell(rowId:number, cellId:number): Observable<any>{
    return this.http.delete(API_URL + `/api/tables/${rowId}/cells/${cellId}`,
      {headers: this.authHeader()});
  }

  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}