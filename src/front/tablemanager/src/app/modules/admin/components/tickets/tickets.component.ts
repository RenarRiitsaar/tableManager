import { Component, OnInit } from '@angular/core';
import { Tickets } from '../../../../model/Tickets';
import { User } from '../../../../model/User';
import { TicketsService } from '../../../../auth/services/tickets/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmComponent } from '../../../../public-components/delete-confirm/delete-confirm.component';
import { catchError, of, tap } from 'rxjs';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {

  constructor(private ticketsService : TicketsService,
              private snackbar : MatSnackBar,
              private dialog: MatDialog){}

  tickets: Tickets[] = [];
  user!: User;

  ngOnInit(): void {
    this.refreshTickets();
  }


  deleteTicket(id : number):void{
    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.ticketsService.deleteTicket(id).pipe(
          tap((res) =>{
            this.snackbar.open('Ticket deleted successfully', 'Close', {duration: 5000});
            this.refreshTickets();
          }),
          catchError((error) => {
            this.snackbar.open('Error deleting ticket', 'Close', {duration : 5000, panelClass: 'error-snackbar'});
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  toggleTicket(id: number): void{
    this.ticketsService.toggleTicket(id).pipe(
      tap((res) =>{
        this.snackbar.open('Ticket activity toggled', 'Close', {duration: 5000});
        this.refreshTickets();
      }),
      catchError((error) => {
        this.snackbar.open('Error toggling ticket', 'Close', {duration : 5000, panelClass: 'error-snackbar'});
        return of(null);
      })
    ).subscribe();
  }

  

  viewTicket(id: number): void {

    this.ticketsService.getTicketById(id).subscribe(ticket => {
      const dialogRef = this.dialog.open(TicketModalComponent, {
      
        data: { message: ticket.message, id: ticket.id, answer: ticket.answer, status: ticket.status }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        this.refreshTickets();
      });
    });
  }
  

  private refreshTickets(){
    this.ticketsService.getAllTickets().subscribe(( data : Tickets[]) => 
      this.tickets = data);
  }

}
