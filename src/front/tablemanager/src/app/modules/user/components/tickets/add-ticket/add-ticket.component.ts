import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketsService } from '../../../../../auth/services/tickets/tickets.service';
import { catchError, of, tap } from 'rxjs';
import { Tickets } from '../../../../../model/Tickets';
import { StorageService } from '../../../../../auth/services/storage/storage.service';
import { UserTicketsComponent } from '../userTickets.component';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent {
  ticketData = {
    message: ''
  };


  constructor(
    public dialogRef: MatDialogRef<AddTicketComponent>,
    public snackbar: MatSnackBar,
    public ticketsService: TicketsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  addTicket(): void {
    this.ticketsService.createTicket(this.ticketData).pipe(
      tap((res) => {
        if (res && res.message !== null) {
          this.snackbar.open("Ticket successfully created", "Close", { duration: 5000 });
        } else {
          this.snackbar.open("Couldn't create ticket!", "Close", { duration: 5000, panelClass: "error-snackbar" });
        }
      }),
      catchError((error) => {
        this.snackbar.open("Couldn't create ticket!", 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        return of(null);
      })
    ).subscribe();
    this.dialogRef.close();
  }
}