import { AdminService } from './../../auth/services/admin/admin.service';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../auth/services/storage/storage.service';
import { User } from '../../model/User';
import { Router } from '@angular/router';
import { UserService } from '../../auth/services/user/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  stripePromise = loadStripe(environment.stripe);
  user: User = StorageService.getUser();
  

  constructor(private http:HttpClient,
              private userService: UserService,
              private router:Router){
  }

  activateTrial(){

    if(this.user.hasTrial){
      
    this.userService.activateTrial(this.user.id).subscribe();
    this.router.navigateByUrl('/success');
    }
  }

  async pay(amount: number): Promise<void>{
    const payment ={
      name: 'Table manager',
      currency: 'eur',
      amount: amount,
      quantity:'1',
      cancelUrl: 'https://tableManager.ee/cancel',
      successUrl: 'https://tableManager.ee/success'
    };

    const stripe = await this.stripePromise;

    this.http.post(`${environment.serverUrl}/api/stripe/payment` + "/" + StorageService.getUserId(), payment).subscribe((data:any) =>{
      stripe?.redirectToCheckout({
        sessionId: data.id,
      });
    });

    
  }

}
