import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
const routes: Routes = [
  {path: "login", component : LoginComponent},
  {path: "signup", component : SignupComponent},
  {path: "admin", loadChildren: () => import("./modules/admin/admin.module").then(e => e.AdminModule)},
  {path: "user", loadChildren: () => import("./modules/user/user.module").then(e => e.UserModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
