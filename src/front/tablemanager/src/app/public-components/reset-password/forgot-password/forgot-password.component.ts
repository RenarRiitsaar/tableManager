import { Component } from '@angular/core';
import { EmailService } from '../../../auth/services/email/email.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  constructor(private emailService: EmailService,
              private snackBar: MatSnackBar,
              private fb: FormBuilder
  ){
   this.forgotPasswordForm = this.fb.group({
      to:['', [Validators.required, Validators.email]]
    });
  }

  sendForgotPassword(){
    if(this.forgotPasswordForm.invalid){
      this.forgotPasswordForm.markAsTouched();
      return;
    }

    let to: string = this.forgotPasswordForm.get('to')?.value;

    this.emailService.forgotPassword(to).pipe(
      tap(() =>{
        this.snackBar.open("Password reset link sent to provided email.", 'Close', {duration: 5000});
      }),
      catchError((error) =>{
        this.snackBar.open("Something went wrong. Please try again.", 'Close', {duration: 5000});
        throw error;
      })
    ).subscribe();
  }

}
