import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { VacationRequest } from '../../../model/VacationRequest';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../storage/storage.service';

const BASE_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class VacationRequestService {

  constructor(private http: HttpClient) { }

  getVacationList(): Observable<VacationRequest[]>{
    return this.http.get<VacationRequest[]>(BASE_URL + '/api/request',
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error('Error getting list: ' + error);
        throw error;
      })
     );
  }
  getRequestById(requestId:number): Observable<any>{
    return this.http.get(BASE_URL + `/api/request/${requestId}`,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Error getting by id: " + error);
        throw error;
      })
    );
  }
  addRequest(vacationRequest: any): Observable<any>{
  
    return this.http.post(BASE_URL + '/api/request', vacationRequest,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Error adding request: " + error);
        throw error;
      })
    );
  }
  updateRequest(request: any): Observable<any>{
    return this.http.put(BASE_URL + `/api/request/${request.id}`, request,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error)=>{
        console.error("Couldn't update request " + error);
        throw error;
      })
    );
  }

  deleteRequest(requestId: number): Observable<any>{
    return this.http.delete(BASE_URL + `/api/request/${requestId}`,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error)=>{
        console.log("Couldn't delte request " + error);
        throw error;
      })
    );
  }
  
  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
