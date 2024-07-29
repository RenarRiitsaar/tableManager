import { Component, OnInit } from '@angular/core';
import { TicketsService } from '../../../../auth/services/tickets/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Tickets } from '../../../../model/Tickets';
import { StorageService } from '../../../../auth/services/storage/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { TicketModalComponent } from '../../../admin/components/ticket-modal/ticket-modal.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';
import { DeleteConfirmComponent } from '../../../../public-components/delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-userTickets',
  templateUrl: './userTickets.component.html',
  styleUrl: './userTickets.component.css'
})
export class UserTicketsComponent implements OnInit {

  tickets: Tickets[] = [];

  constructor(private ticketsService: TicketsService,
              private snackbar : MatSnackBar,
              private dialog : MatDialog){

              }


  ngOnInit(): void {
    let userId = StorageService.getUserId();
    this.refreshTickets(userId);
  }

  viewTicket(id:number):void{
    this.ticketsService.getTicketById(id).subscribe(ticket => {
      const dialogRef = this.dialog.open(ViewTicketComponent, {
      
        data: { message: ticket.message, id: ticket.id, answer: ticket.answer, status: ticket.status }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log("Closed message modal");
      });
    });
  }

  deleteTicket(id : number):void{
    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.ticketsService.deleteTicket(id).pipe(
          tap((res) =>{
            this.snackbar.open('Ticket deleted successfully', 'Close', {duration: 5000});
            this.refreshTickets(StorageService.getUserId());
    
          }),
          catchError((error) => {
            this.snackbar.open('Error deleting ticket', 'Close', {duration : 5000, panelClass: 'error-snackbar'});
            return of(null);
          })
        ).subscribe();
      }
    });
  }

public refreshTickets(id :number){
    this.ticketsService.findByUserId(id).subscribe(( data : Tickets[]) => 
      this.tickets = data);
  }
}
