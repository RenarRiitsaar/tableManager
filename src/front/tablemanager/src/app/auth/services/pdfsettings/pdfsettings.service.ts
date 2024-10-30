import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { PdfSettings } from '../../../model/PdfSettings';
import { StorageService } from '../storage/storage.service';

const BASIC_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class PdfsettingsService {
  

  constructor(private http: HttpClient) {}
   
  uploadFile(file : File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(BASIC_URL + "/api/pdf/upload", formData, {
      headers: this.authHeader()
    });
  }

  deleteLogo(logoUrl:string): Observable<any>{
    return this.http.delete(BASIC_URL + `/api/user/${logoUrl}`,{
      headers: this.authHeader()
    }).pipe(
      catchError((error) =>{
        console.error("Error getting vacation days: " + error);
        throw error;
      })
    );
  }

  getPdfSettings(): Observable<PdfSettings>{
    return this.http.get<PdfSettings>(BASIC_URL + "/api/pdf/getPdfSettings",
      {headers: this.authHeader()}).pipe(
        catchError((error) => {
          console.error('Error getting pdf settings' + error);
          throw error;
        })
      );
  }

  addPdfSettings(Request: any): Observable<PdfSettings>{
    return this.http.post<PdfSettings>(BASIC_URL + "/api/pdf/addPdfSettings", Request,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Error adding pdf settings", error)
        throw error;
      })
    );
  } 

  updateSettings(pdfSettings:PdfSettings): Observable<PdfSettings>{
    return this.http.put<PdfSettings>(BASIC_URL + "/api/pdf/updatePdfSettings", pdfSettings,
      {headers: this.authHeader()}
     ).pipe(
      catchError((error) => {
        console.error("Error updating pdf settings", error)
        throw error;
      })
     );
  }

  deleteSettings(): Observable<any>{
    return this.http.delete(BASIC_URL + "/api/pdf/deletePdfSettings",
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) => {
        console.error("Couldn't delete pdf settings", error);
        throw error;
      })
    );
  }

  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
