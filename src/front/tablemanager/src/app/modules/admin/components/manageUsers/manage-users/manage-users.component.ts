import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../../auth/components/services/auth/admin/admin.service';
import { User } from '../../../../user/User';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

const BASIC_URL = "http://localhost:8080";

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})


export class ManageUsersComponent implements OnInit {
  
  users: User[] = [];
  
  constructor(private adminService : AdminService,
              private http: HttpClient,
              private snackbar: MatSnackBar){

  }
  ngOnInit(): void {
    this.adminService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }
  
deleteUser(id : number): void{
  this.adminService.deleteUser(id).pipe(
    tap((res) => {
      this.snackbar.open('User deleted successfully', 'Close', {duration: 5000});
      this.adminService.getUsers().subscribe((data: User[]) => {
        this.users = data;
      })
      
    }),
    catchError((error) => {
      this.snackbar.open('Error deleting user', 'Close', {duration: 5000, panelClass: 'error-snackbar'});
      return of(null);
    })
  ).subscribe();
}
}
