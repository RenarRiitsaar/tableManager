import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';


const API_URL = "http://localhost:8080"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signUp(signupRequest: any): Observable<any>{
    return this.http.post(API_URL+"/api/auth/signup", signupRequest).pipe(
      catchError(this.handleError)
    );
  }

  login(loginRequest: any): Observable<any>{
     return this.http.post(API_URL+"/api/auth/login", loginRequest).pipe(
      catchError(this.handleError)
    );
  }
  handleError(error: HttpErrorResponse): Observable<never> {
   if(error.status === 401){
    return throwError(() => error.message)
   }else if(error.status === 400){
    return throwError(() => error.message);
   }else{
    return throwError(() => error.message);
   }
  }
}
