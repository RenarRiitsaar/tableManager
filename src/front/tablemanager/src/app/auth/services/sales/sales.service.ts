import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../storage/storage.service';
import { Sales } from '../../../model/Sales';

const BASIC_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http:HttpClient) { }


  downloadFile(userId: number, filename:number): Observable<Blob>{
    return this.http.get(`${BASIC_URL}/sales/download/${userId}/${filename}.pdf`,
      {responseType: 'blob'}
     );

  }

  uploadFile(formData: FormData): Observable<any>{
    return this.http.post(BASIC_URL + '/sales/uploadFile', formData,
      {headers: this.authHeader()}
    );
  }

  getSales(): Observable<any>{
    return this.http.get<Sales[]>(BASIC_URL + '/sales/getAll',
      {headers: this.authHeader()}
    ).pipe(
      catchError((error)=>{
        console.error(error);
        throw error;
      })
    );
  }

  saveSale(sale: Sales): Observable<any>{
    return this.http.post(BASIC_URL + '/sales/saveSale', sale,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error(error);
        throw error;
      })
    );
  }

  deleteSale(sale: Sales): Observable<any>{
    return this.http.delete(BASIC_URL + '/sales/deleteSale',
      {headers:this.authHeader(),
        body: sale
      }
    ).pipe(
      catchError((error) =>{
        console.error(error);
        throw error;
      })
    );
  }

  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
