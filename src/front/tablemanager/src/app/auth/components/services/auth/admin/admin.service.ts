import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { catchError, Observable } from 'rxjs';
import { User } from '../../../../../modules/user/User';

const BASIC_URL = "http://localhost:8080"

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
users: User[] = [];

  constructor(private http: HttpClient) { }


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
        console.error('error deleting user: ' + error);
        throw error;
      })
    );
  }

  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
