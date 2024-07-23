import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UDashboardComponent } from './components/u-dashboard/u-dashboard.component';
import { EntriesComponent } from './components/entries/entries.component';
import { UserTicketsComponent } from './components/tickets/userTickets.component';




@NgModule({
  declarations: [
    UDashboardComponent,
    EntriesComponent,
    UserTicketsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
