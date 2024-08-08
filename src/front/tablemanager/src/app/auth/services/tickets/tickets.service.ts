import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Tickets } from '../../../model/Tickets';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

const BASIC_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
 
  constructor(private http: HttpClient) { }


  answerTicket(id:number, answer: string): Observable<any>{
    return this.http.put<Tickets>(BASIC_URL + "/api/tickets/answerTicket/" + id,{answer},{headers: this.authHeader()})
    .pipe(
      catchError((error) => {
        console.error("Couldn't answer to ticket.", error);
        throw error;
      })
    );
  }

  toggleTicket(id: number): Observable<any> {
   return this.http.put<Tickets>(BASIC_URL + "/api/tickets/toggleTicket/" + id,{headers: this.authHeader()})
    .pipe(
      catchError((error) => {
        console.error("Couldn't toggle ticket status.", error);
        throw error;
      })
    );
  }

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
   
   findByUserId(userId: number): Observable<any>{
    return this.http.get(BASIC_URL + "/api/tickets/user/" + userId,
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
