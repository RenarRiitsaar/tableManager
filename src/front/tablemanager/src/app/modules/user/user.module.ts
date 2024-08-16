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
import { PdfGeneratorComponent } from './components/entries/pdf-generator/pdf-generator.component';
import { AddPdfSettingsComponent } from './components/pdf-settings/add-pdf-settings/add-pdf-settings.component';
import { MatInputModule } from '@angular/material/input';
import { EditPDFComponent } from './components/pdf-settings/edit-pdf/edit-pdf.component';







@NgModule({
  declarations: [
    UDashboardComponent,
    EntriesComponent,
    UserTicketsComponent,
    AddTicketComponent,
    ViewTicketComponent,
    VatModalComponent,
    PdfGeneratorComponent,
    AddPdfSettingsComponent,
    EditPDFComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatError,
    ReactiveFormsModule,
    MatInputModule
    
  ]
})
export class UserModule { }
