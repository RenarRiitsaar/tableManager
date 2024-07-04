import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { ADashboardComponent } from './modules/admin/components/a-dashboard/a-dashboard.component';
import { UDashboardComponent } from './modules/user/components/u-dashboard/u-dashboard.component';
const routes: Routes = [
  {path: "login", component : LoginComponent},
  {path: "admin/dashboard", component: ADashboardComponent},
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
