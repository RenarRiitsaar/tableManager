import {UserTicketsComponent} from './modules/user/components/tickets/userTickets.component'
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { ADashboardComponent } from './modules/admin/components/a-dashboard/a-dashboard.component';
import { UDashboardComponent } from './modules/user/components/u-dashboard/u-dashboard.component';
import { ManageUsersComponent } from './modules/admin/components/manage-users/manage-users.component';
import { TicketsComponent } from './modules/admin/components/tickets/tickets.component';
import { EntriesComponent } from './modules/user/components/entries/entries.component';
import { CheckoutComponent } from './stripe/checkout/checkout.component';
import { SuccessComponent } from './stripe/success/success.component';
import { CancelComponent } from './stripe/cancel/cancel.component';
import { HomeComponent } from './public-components/home/home.component';
import { QuickstartComponent } from './public-components/quickstart/quickstart.component';
import { ContactUsComponent } from './public-components/contact-us/contact-us.component';
import { ForgotPasswordComponent } from './public-components/reset-password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './public-components/reset-password/reset-password/reset-password.component';
import { SendMailComponent } from './modules/user/components/send-mail/send-mail.component';
import { SalesComponent } from './modules/user/components/sales/sales/sales.component';
import { TableComponent } from './modules/user/components/table/table.component';
import { VacationListComponent } from './modules/user/components/vacation-list/vacation-list.component';
import { EmployeesComponent } from './modules/user/components/employees/employees.component';
import { ScheduleCalendarComponent } from './modules/user/components/employees/schedule-calendar/schedule-calendar.component';
import { WorkSummaryComponent } from './modules/user/components/employees/work-summary/work-summary.component';
const routes: Routes = [

  {path:"scheduleCalendar", component:ScheduleCalendarComponent},
  {path:"workSummary", component: WorkSummaryComponent},
  {path: "employees", component : EmployeesComponent},
  {path: "vacation", component : VacationListComponent},
  {path: "table", component : TableComponent},
  {path: "sales", component : SalesComponent},
  {path: "sendMail", component : SendMailComponent},
  {path: "resetPassword", component : ResetPasswordComponent},
  {path: "forgotPassword", component : ForgotPasswordComponent},
  {path: "contact-us", component : ContactUsComponent},
  {path: "quickstart", component : QuickstartComponent},
  {path: "", component : HomeComponent},
  {path: "checkout", component : CheckoutComponent},
  {path: "success", component : SuccessComponent},
  {path: "cancel", component : CancelComponent},
  {path: "user/tickets", component : UserTicketsComponent},
  {path: "user/entry", component : EntriesComponent},
  {path: "admin/tickets", component : TicketsComponent},
  {path: "admin/tickets", component : TicketsComponent},
  {path: "login", component : LoginComponent},
  {path: "admin/dashboard", component: ADashboardComponent},
  {path: "admin/manageUsers", component: ManageUsersComponent},
  {path: "user/dashboard", component: UDashboardComponent},
  {path: "signup", component : SignupComponent},
  {path: "admin", loadChildren: () => import("./modules/admin/admin.module").then(e => e.AdminModule)},
  {path: "user", loadChildren: () => import("./modules/user/user.module").then(e => e.UserModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
