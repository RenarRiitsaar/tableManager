import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Entry } from '../../../model/Entry';
import { StorageService } from '../storage/storage.service';


const BASIC_URL = "http://localhost:8080"

@Injectable({
  providedIn: 'root'
})
export class EntriesService {

  constructor(private http: HttpClient) { }


  getEntries():Observable<Entry[]>{
    return this.http.get<Entry[]>(BASIC_URL + "/api/entry/entries",{
      headers: this.authHeader()
    }).pipe(
      catchError((error) => {
        console.error('error getting users: ' + error);
        throw error;
      })
    );
  }

  addEntry(EntryRequest: any): Observable<Entry>{
    return this.http.post<Entry>(BASIC_URL + "/api/entry/addEntry", EntryRequest,
      {headers: this.authHeader()})
    .pipe(
      catchError((error) => {
        console.error("Error adding entry", error)
        throw error;
      })
    );
  }

  deleteEntry(entryId:number):Observable<any>{
    return this.http.delete(BASIC_URL + "/api/entry/deleteEntry/" + entryId,
       {headers: this.authHeader()})
    .pipe(
      catchError((error) => {
        console.error("Couldn't delete the ticket", error);
        throw error;
      })
    );
  }


  updateEntry(entryId:number, value: any): Observable<any>{
    return this.http.put(BASIC_URL + "/api/entry/updateEntry/" + entryId, value, 
      {headers: this.authHeader()})
    .pipe(
      catchError((error) => {
        console.error("Error updating ticket", error);
        throw error;
      })
    );
  }


  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
