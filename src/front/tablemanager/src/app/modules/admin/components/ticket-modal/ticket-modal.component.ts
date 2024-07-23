import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, tap } from 'rxjs';
import { TicketsService } from '../../../../auth/services/tickets/tickets.service';
import { Tickets } from '../../../../model/Tickets';

@Component({
  selector: 'app-ticket-modal',
  templateUrl: './ticket-modal.component.html',
  styleUrl: './ticket-modal.component.css'
})
export class TicketModalComponent{

  tickets: Tickets[] =[];
  
  constructor(
    public dialogRef: MatDialogRef<TicketModalComponent>,
    public snackbar: MatSnackBar,
    public ticketsService: TicketsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}





  onClose(): void {
    this.dialogRef.close();
  }
  
  answerTicket(id:number): void{
    this.ticketsService.answerTicket(id, this.data.answer).pipe(
      tap((res) =>{
        this.snackbar.open('Ticket answered', 'Close', {duration: 5000});
      
      }),
      catchError((error) => {
        this.snackbar.open('Error answering ticket', 'Close', {duration : 5000, panelClass: 'error-snackbar'});
        return of(null);
      })
    ).subscribe();
    this.dialogRef.close();
    
  }
  }

