import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  stripePromise = loadStripe(environment.stripe);

  constructor(private http:HttpClient){
    
  }

  async pay(): Promise<void>{
    const payment ={
      name: 'Table manager',
      currency: 'eur',
      amount: 30000,
      quantity:'1',
      cancelUrl: 'http://localhost:4200/cancel',
      successUrl: 'http://localhost:4200/success'
    };

    const stripe = await this.stripePromise;

    this.http.post(`${environment.serverUrl}/api/stripe/payment`, payment).subscribe((data:any) =>{
      stripe?.redirectToCheckout({
        sessionId: data.id,
      });
    });
  }

}
