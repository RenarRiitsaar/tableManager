import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

const BASIC_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  activateTrial(userId : number): Observable<any>{
    return this.http.post(BASIC_URL + '/api/user/activateTrial/' + userId, {headers:this.authHeader()}
  ).pipe(
    catchError((error) =>{
      console.error("Error activating trial for user", error);
      throw error;
    }))
  }

  updateUser(value:any):Observable<any>{
    return this.http.put(BASIC_URL + '/api/user/editUserInfo',value,
    {headers:this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Error updating user", error);
        throw error;
      })
    )
  }

  deleteUser(): Observable<any>{
    return this.http.delete(BASIC_URL + '/api/user/deleteUser',
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) => {
        console.error("Error deleting user", error);
        throw error;
      })
    );
  }

  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
