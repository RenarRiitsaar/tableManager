import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Tickets } from '../../../modules/admin/components/tickets/Tickets';
import { catchError, Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8080"

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private http: HttpClient) { }


    getAllTickets(): Observable<Tickets[]>{
      return this.http.get<Tickets[]>(BASIC_URL + "/api/tickets/all",
        {headers: this.authHeader()})
        .pipe(
          catchError((error) => {
            console.error("Couldn't get tickets.", error);
            throw error;
          })
        );
    }

    getTicketById(id: number): Observable<Tickets>{
      return this.http.get<Tickets>(BASIC_URL + "/api/tickets/" + id,
        {headers:this.authHeader()})
        .pipe(
          catchError((error) => {
            console.error("Couldn't get the ticket", error)
            throw error;
          })
        );
    }

    createTicket(ticketRequest: any): Observable<Tickets>{
      return this.http.post<Tickets>(BASIC_URL + "/api/tickets/newTicket", ticketRequest,
        {headers: this.authHeader()})
        .pipe(
          catchError((error) => {
            console.error("Error creating ticket", error)
            throw error;
          })
        );
    }

    updateTicket(ticketId: number, value:any): Observable<any>{

      return this.http.put(BASIC_URL + "/api/tickets/update/" + ticketId, value, 
        {headers: this.authHeader()})
        .pipe(
          catchError((error) => {
            console.error("Error updating ticket", error);
            throw error;
          })
        );
   }

   deleteTicket(ticketId: number): Observable<any>{
    return this.http.delete(BASIC_URL + "/api/tickets/delete/" + ticketId, 
      {headers: this.authHeader()})
      .pipe(
        catchError((error) => {
          console.error("Couldn't delete the ticket", error);
          throw error;
        })
      );
   }
   

    private authHeader() {
      return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    }
}
