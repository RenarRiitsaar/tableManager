import { FullCalendarModule } from '@fullcalendar/angular';
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
import { ProductSelectorComponent } from './components/entries/product-selector/product-selector.component';
import { EditUserComponent } from './components/userProfile/edit-user/edit-user.component';
import { SendMailComponent } from './components/send-mail/send-mail.component';
import { SalesComponent } from './components/sales/sales/sales.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EditCellComponent } from './components/table/edit-cell/edit-cell.component';
import { TableComponent } from './components/table/table.component';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VacationListComponent } from './components/vacation-list/vacation-list.component';
import { AddVacationComponent } from './components/vacation-list/add-vacation/add-vacation.component';
import { EditVacationComponent } from './components/vacation-list/edit-vacation/edit-vacation.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/employees/edit-employee/edit-employee.component';
import { VacationCalendarComponent } from './components/vacation-list/vacation-calendar/vacation-calendar.component';
import { ScheduleCalendarComponent } from './components/employees/schedule-calendar/schedule-calendar.component';
import { AddEventComponent } from './components/employees/schedule-calendar/add-event/add-event.component';
import { EditEventComponent } from './components/employees/schedule-calendar/edit-event/edit-event.component';
import { WorkSummaryComponent } from './components/employees/work-summary/work-summary.component';
import { HowToComponent } from './components/employees/schedule-calendar/how-to/how-to.component';
import { CellInfoComponent } from './components/employees/work-summary/cell-info/cell-info.component';









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
    EditPDFComponent,
    ProductSelectorComponent,
    EditUserComponent,
    SendMailComponent,
    SalesComponent,
    TableComponent,
    EditCellComponent,
    VacationListComponent,
    AddVacationComponent,
    EditVacationComponent,
    EmployeesComponent,
    AddEmployeeComponent,
    EditEmployeeComponent,
    VacationCalendarComponent,
    ScheduleCalendarComponent,
    AddEventComponent,
    EditEventComponent,
    WorkSummaryComponent,
    HowToComponent,
    CellInfoComponent
  
  ],
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatError,
    ReactiveFormsModule,
    MatInputModule,
    NgxChartsModule,
    MatOptionModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    BrowserModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FullCalendarModule

    
    
  ]
})
export class UserModule { }
