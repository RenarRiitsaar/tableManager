import { StorageService } from './../../../auth/services/storage/storage.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './../../../auth/services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../auth/services/admin/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../model/User';
import { catchError, tap } from 'rxjs';
import { EmailService } from '../../../auth/services/email/email.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{
  resetPasswordForm : FormGroup;
  token!: string;

  constructor(private emailService:EmailService,
              private snackbar: MatSnackBar,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router
  ){
    this.resetPasswordForm = this.fb.group({
      password :['', [Validators.required]],
      passwordMatch: ['', [Validators.required]]
    });
    
  }
  ngOnInit(): void {
   this.token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';
  }

  resetPassword(){
    if(this.resetPasswordForm.invalid || this.token === null){
      return;
    }

  this.emailService.resetPassword(this.token, this.resetPasswordForm.get('password')?.value).pipe(
    tap(()=>{
      this.snackbar.open("Password changed successfully.", 'Close', {duration:5000});
    }),
    catchError((error) =>{
      this.snackbar.open("Error resetting password", 'Close', {duration: 5000})
      throw error;
    })
  ).subscribe();
  this.router.navigateByUrl('/login');
  }
}
