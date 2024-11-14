import { User } from '../../../model/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { catchError, Observable, tap } from 'rxjs';
import { MatSnackBar, matSnackBarAnimations } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';


const BASIC_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  
users: User[] = [];

  constructor(private http: HttpClient) { }


  updateUser(userId: number, value: any): Observable<any> {
    return this.http.put(BASIC_URL + "/api/admin/users/" + userId, value,
      {headers: this.authHeader()}).pipe(
        catchError((error) => {
          
          console.error("Error updating user: " + error.message)
          throw error;
        })
      );
  }

  toggleUserActive(id: number): Observable<any>{
    return this.http.put(BASIC_URL + "/api/admin/users/toggleUser/" + id,{},
    {headers:this.authHeader()}).pipe(
      catchError((error) => {
        console.error("Error setting user active/inactive" + error);
        throw error;
      })
    );
  }

  deleteUser(id:number): Observable<any> {
    return this.http.delete(BASIC_URL + "/api/admin/users/delete/" + id,
     {headers: this.authHeader()
  }).pipe(
    catchError((error) => {
      console.error('error deleting user: ' + error);
      throw error;
    })
  );
  }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(BASIC_URL + "/api/admin/users",{
      headers: this.authHeader()
    }).pipe(
      catchError((error) => {
        console.error('error getting users: ' + error);
        throw error;
      })
    );
  }

  getUserById(id: number): Observable<User>{
    return this.http.get<User>(BASIC_URL + "/api/admin/users/" +id,{
      headers:this.authHeader()
      }).pipe(
        catchError((error) => {
        console.error("Couldnt get user: " + error);
      throw error;
  })
  );
  }

  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
