import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ADashboardComponent } from './components/a-dashboard/a-dashboard.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ADashboardComponent,
    ManageUsersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
