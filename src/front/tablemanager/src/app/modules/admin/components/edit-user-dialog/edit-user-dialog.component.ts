import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../auth/services/admin/admin.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../user/User';
import { catchError, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent implements OnInit{

  editUserForm!: FormGroup;
  userId!: number;

  constructor(private fb:FormBuilder,
              private adminService: AdminService,
              private snackbar: MatSnackBar,
              private dialogRef: MatDialogRef<EditUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {userId:number}
  ){
    this.userId = data.userId;
  }

  ngOnInit(): void {
    this.editUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.getUser();
  }
  getUser(): void {
    this.adminService.getUserById(this.userId).pipe(
      tap((data: User) => {
        this.editUserForm.patchValue(data);

      }),
      catchError((error) => {
        this.snackbar.open('Error toggling user activity', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        return of(null);

      })
    ).subscribe();
}

  onSubmit(): void{
    if(this.editUserForm.valid){
      this.adminService.updateUser(this.userId, this.editUserForm.value).pipe(
        tap((res) => {
          console.log('user updated');
          this.snackbar.open("User updated successfully", 'Close', {duration:5000});
          this.dialogRef.close(true);
        }),
        catchError((error) =>{
        if(error.status === 409){
          this.snackbar.open('Email already exists', 'Close', {duration: 5000})
        }
          throw error;
        })
      ).subscribe();
    }
  }

onCancel(): void {
  this.dialogRef.close(false);
    }
 }
