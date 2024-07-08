
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../../auth/components/services/auth/admin/admin.service';
import { User } from '../../../../user/User';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmComponent } from '../../../../../public-components/delete-confirm/delete-confirm.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditUserDialogComponent } from '../../edit-user-dialog/edit-user-dialog.component';

const BASIC_URL = "http://localhost:8080";

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})


export class ManageUsersComponent implements OnInit {
  
  editUserForm!: FormGroup;
  users: User[] = [];

  
  constructor(private adminService : AdminService,
              private http: HttpClient,
              private snackbar: MatSnackBar,
              private dialog: MatDialog
              ){ }


  ngOnInit(): void {
    this.refreshUsers();
  }


  openEditUserDialog(userId:number): void{
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
    width: '400px',
      data: {userId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.refreshUsers();
      }
      
    })
  }
 

  toggleUserActivity(id: number): void {
    this.adminService.toggleUserActive(id).pipe(
      tap((res) =>{
        this.snackbar.open('User activity status toggled', 'Close', { duration: 5000 });
        this.refreshUsers();
      }),
    
      catchError((error) => {
        this.snackbar.open('Error toggling user activity', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        return of(null);
      })
    ).subscribe();
  }
  
deleteUser(id : number): void{
  const dialogRef = this.dialog.open(DeleteConfirmComponent);

  dialogRef.afterClosed().subscribe(res => {
    if(res){
      this.adminService.deleteUser(id).pipe(
        tap((res) => {
          this.snackbar.open('User deleted successfully', 'Close', {duration: 5000});
          this.refreshUsers();
          
        }),
        catchError((error) => {
          this.snackbar.open('Error deleting user', 'Close', {duration: 5000, panelClass: 'error-snackbar'});
          return of(null);
        })
      ).subscribe();
    }
  });
}

  private refreshUsers() {
    this.adminService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }
}
