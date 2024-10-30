import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { User } from '../../../model/User';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../storage/storage.service';


const BASIC_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class StripeServiceService {

  constructor(private http: HttpClient) { }

  toggleUserActive(userId: number): Observable<any>{
    return this.http.put(BASIC_URL + "/api/stripe/success/" + userId,{
      headers:this.authHeader()
    }).pipe(
      catchError((error) =>{
      console.error(error)
      throw error;
    })
    );
  }

  getUserStatus(): Observable<any>{
    return this.http.get(BASIC_URL +"/api/stripe/userStatus",{
      headers:this.authHeader()
    }).pipe(
      catchError((error) =>{
      console.error(error)
      throw error;
    })
  );
  }

  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
