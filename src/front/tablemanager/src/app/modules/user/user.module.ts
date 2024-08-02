import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UDashboardComponent } from './components/u-dashboard/u-dashboard.component';
import { EntriesComponent } from './components/entries/entries.component';
import { UserTicketsComponent } from './components/tickets/userTickets.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewTicketComponent } from './components/tickets/view-ticket/view-ticket.component';
import { AddTicketComponent } from './components/tickets/add-ticket/add-ticket.component';
import { VatModalComponent } from './components/entries/vat-modal/vat-modal.component';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';





@NgModule({
  declarations: [
    UDashboardComponent,
    EntriesComponent,
    UserTicketsComponent,
    AddTicketComponent,
    ViewTicketComponent,
    VatModalComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatError,
    ReactiveFormsModule
    
  ]
})
export class UserModule { }
