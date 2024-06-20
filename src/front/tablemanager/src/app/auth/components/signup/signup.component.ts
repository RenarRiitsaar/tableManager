import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signupForm!: FormGroup;
  hidePassword= true

  constructor(private fb: FormBuilder,
    private authService:AuthService,
    private snackbar: MatSnackBar,
    private router:Router){

    this.signupForm = this.fb.group({
      firstName:[null,[Validators.required]],
      lastName:[null,[Validators.required]],
      email:[null,[Validators.email]],
      username:[null,[Validators.required]],
      password:[null,[Validators.required]],
      confirmPassword:[null,[Validators.required]],
      
    })
  }
  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  }
  onSubmit(){
    const password = this.signupForm.get("password")?.value;
    const confirmPassword = this.signupForm.get("confirmPassword")?.value;

    if(password !== confirmPassword){
      this.snackbar.open("Passwords do not match", "Close", {duration: 5000, panelClass: "error-snackbar"});
      return;
    }

    this.authService.signUp(this.signupForm.value).pipe(
      tap((res) => {
      if(res.id !== null){
        this.snackbar.open("Signup successful", "Close", {duration : 5000});
        this.router.navigateByUrl("/login");
      }else{
        this.snackbar.open("Username or email already in use!", "Close", {duration: 5000, panelClass:"error-snackbar"});
      }
    }),
    catchError((error) =>{
      this.snackbar.open('Username or email already in use!', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      return of(null);
    })).subscribe();
  }
}
