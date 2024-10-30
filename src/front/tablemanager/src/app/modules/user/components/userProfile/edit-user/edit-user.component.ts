import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../../auth/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap } from 'rxjs';
import { User } from '../../../../../model/User';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
  editUserForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private snackbar:MatSnackBar,
              private dialogRef: MatDialogRef<EditUserComponent>
  ){}


  ngOnInit(): void {
    
    this.editUserForm = this.fb.group({
      password: ['', Validators.required],
      passwordMatch: ['', Validators.required]
    });
  }

  onSubmit(){
    const password = this.editUserForm.get("password")?.value;
    const confirmPassword = this.editUserForm.get("passwordMatch")?.value;

    if(password !== confirmPassword){
      this.snackbar.open("Passwords do not match", "Close", {duration: 5000, panelClass: "error-snackbar"});
      return;
    }
    if(this.editUserForm.valid){
      this.userService.updateUser(this.editUserForm.value).pipe(
        tap(()=>{
          this.snackbar.open("User updated successfully", 'Close', {duration:5000});
          this.dialogRef.close(true);
        }),
        catchError((error) =>{
          console.error(error);
          this.snackbar.open("Couldn't update user!", 'Close', {duration: 5000});
          throw error;
        })
      ).subscribe();
    }
  }
  onCancel(){
    this.dialogRef.close(false);
  }
}
