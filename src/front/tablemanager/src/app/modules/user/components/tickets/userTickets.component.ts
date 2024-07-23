import { Component, OnInit } from '@angular/core';
import { TicketsService } from '../../../../auth/services/tickets/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Tickets } from '../../../../model/Tickets';
import { StorageService } from '../../../../auth/services/storage/storage.service';

@Component({
  selector: 'app-userTickets',
  templateUrl: './userTickets.component.html',
  styleUrl: './userTickets.component.css'
})
export class UserTicketsComponent implements OnInit {

  tickets: Tickets[] = [];

  constructor(private ticketsService: TicketsService,
              private snackbar : MatSnackBar,
              private dialog : MatDialog){}


  ngOnInit(): void {
    let userId = StorageService.getUserId();
    this.refreshTickets(userId);
  }

  

private refreshTickets(id :number){
    this.ticketsService.findByUserId(id).subscribe(( data : Tickets[]) => 
      this.tickets = data);
  }
}
