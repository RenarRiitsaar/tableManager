import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ADashboardComponent } from './components/a-dashboard/a-dashboard.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardModule } from '@angular/material/card';
import { TicketsComponent } from './components/tickets/tickets.component';
import { TicketModalComponent } from './components/ticket-modal/ticket-modal.component';
import { MatDialogTitle } from '@angular/material/dialog';



@NgModule({
  declarations: [
    ADashboardComponent,
    ManageUsersComponent,
    TicketsComponent,
    TicketModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogTitle

  ]
})
export class AdminModule { }
