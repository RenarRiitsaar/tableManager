import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

const BASIC_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class EmailService {

 
  constructor(private http: HttpClient) {}

  sendClientEmail(emailPayload : any): Observable<any>{
    let params = new HttpParams()
    .set('from', emailPayload.from)
    .set('to', emailPayload.to)
    .set('subject', emailPayload.subject)
    .set('body', emailPayload.body)
    .set('attachmentPath', emailPayload.attachmentPath);

    return this.http.post(BASIC_URL + '/api/email/sendEmail', params.toString(),
      {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
  }

  uploadAttachment(file:File, userId: number): Observable<any>{
 
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', userId.toString());
  
      return this.http.post(BASIC_URL + "/api/email/uploadFile", formData, {
        headers: this.authHeader()
      });
  }

  

  forgotPassword(to: string): Observable<any>{
    let params = new HttpParams()
    .set('to', to);

    return this.http.post(BASIC_URL + '/api/email/forgotPassword', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  contactUs(from:string, subject:string, body:string): Observable<any>{
   let params = new HttpParams()
   .set('from', from)
   .set('subject', subject)
   .set('body', body);

   return this.http.post(BASIC_URL + '/api/email/contact', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
   });
  }

  resetPassword(token: string, password: string): Observable<any>{
    let params = new HttpParams()
    .set('token', token)
    .set('password', password);

    return this.http.put(BASIC_URL + "/api/email/resetPassword", params.toString(),
    {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
    
  }
  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
