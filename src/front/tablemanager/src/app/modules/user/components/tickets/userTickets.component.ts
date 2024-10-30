import { Component, OnInit } from '@angular/core';
import { TicketsService } from '../../../../auth/services/tickets/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Tickets } from '../../../../model/Tickets';
import { StorageService } from '../../../../auth/services/storage/storage.service';
import { catchError, of, tap } from 'rxjs';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';
import { DeleteConfirmComponent } from '../../../../public-components/delete-confirm/delete-confirm.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { deleteSlideOut, fade, slideIn } from '../../../../animations';

@Component({
  selector: 'app-userTickets',
  templateUrl: './userTickets.component.html',
  styleUrl: './userTickets.component.css',
  animations:[
    fade, slideIn,deleteSlideOut
    ]
})
export class UserTicketsComponent implements OnInit {

  slideStates: { [key: number]: 'in' | 'out' } = {};
  slideIn = 'out';
  tickets: Tickets[] = [];

  constructor(private ticketsService: TicketsService,
              private snackbar : MatSnackBar,
              private dialog : MatDialog){

              }


  ngOnInit(): void {
    this.onAnimate();
    let userId = StorageService.getUserId();
    this.refreshTickets(userId);
  }

  onAnimate(){
    setTimeout(() => {
    this.slideIn == 'out' ? this.slideIn = "in" : this.slideIn = 'out';
  },100);

  }

  addTicket(){
    const dialogRef = this.dialog.open(AddTicketComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshTickets(StorageService.getUserId());
      if (result) {
        console.log('Ticket created:', result);
      }
    });
  }

  viewTicket(id:number):void{
    this.ticketsService.getTicketById(id).subscribe(ticket => {
      const dialogRef = this.dialog.open(ViewTicketComponent, {
      
        data: { message: ticket.message, id: ticket.id, answer: ticket.answer, status: ticket.status }
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });
    });
  }

  deleteTicket(id : number):void{
    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.slideStates[id] = 'out';

        setTimeout(() =>{
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
      })
      }
    });
  }

  

public refreshTickets(id :number){
    this.ticketsService.findByUserId(id).subscribe(( data : Tickets[]) => 
      this.tickets = data);
  }
}
