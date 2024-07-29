import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UDashboardComponent } from './components/u-dashboard/u-dashboard.component';
import { EntriesComponent } from './components/entries/entries.component';
import { UserTicketsComponent } from './components/tickets/userTickets.component';
import { AddTicketComponent } from './components/tickets/add-ticket/add-ticket.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ViewTicketComponent } from './components/tickets/view-ticket/view-ticket.component';





@NgModule({
  declarations: [
    UDashboardComponent,
    EntriesComponent,
    UserTicketsComponent,
    AddTicketComponent,
    ViewTicketComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule
  ]
})
export class UserModule { }
