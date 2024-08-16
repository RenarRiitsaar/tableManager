import { StorageService } from './../../auth/services/storage/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { StripeServiceService } from '../../auth/services/stripe/stripe-service.service';
import { User } from '../../model/User';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
  user!: User;
  
  constructor(private stripeService:StripeServiceService,
              private snackbar:MatSnackBar){}

  ngOnInit(): void {
    this.setUserEnabled();
    StorageService.logout();
       
  }

  setUserEnabled(){
    const userId = StorageService.getUserId();
    this.stripeService.toggleUserActive(userId).pipe(
      tap(() =>{
        
        this.snackbar.open("Payment successful!", 'Close', {duration:5000});
      }),
      catchError((error) =>{
        console.error(error);
        return of(null);
      })
    ).subscribe();
  }

}
