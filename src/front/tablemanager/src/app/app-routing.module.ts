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
const routes: Routes = [

  
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
