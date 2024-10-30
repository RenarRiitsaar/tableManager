import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { catchError, Observable } from 'rxjs';
import { EmployeeEvent } from '../../../model/EmployeeEvent';

const BASE_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class EmployeeEventService {

  constructor(private http:HttpClient) { }

  getEvents(): Observable<EmployeeEvent[]>{
    return this.http.get<EmployeeEvent[]>(BASE_URL + '/api/event',
      {headers: this.authHeader()} 
    ).pipe(
      catchError((error) =>{
        console.error("Cannot get employee events: " + error);
        throw error;
      })
    );
  }

  getEventById(id:number): Observable<any>{
    return this.http.get(BASE_URL + `/api/event/${id}`,
      {headers: this.authHeader()} 
    ).pipe(
      catchError((error) =>{
        console.error("Cannot get employee event: " + error);
        throw error;
      })
    );
  }

  addEvent(event:any): Observable<any>{
    return this.http.post(BASE_URL + '/api/event', event,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Error adding an event " + error);
        throw error;
      })
    );
  }

  updateEvent(eventId:number): Observable<any>{
    return this.http.put(BASE_URL + `/api/event/${eventId}`,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Error updating an event " + error);
        throw error;
      })
    );
  }

  deleteEvent(eventId: number): Observable<any>{
    return this.http.delete(BASE_URL + `/api/event/${eventId}`,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Error deleting an event " + error);
        throw error;
      })
    );
  }

  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
