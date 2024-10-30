import { Component } from '@angular/core';
import { EmailService } from '../../auth/services/email/email.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  contactForm: FormGroup;
  
 
  constructor(private emailService: EmailService,
              private snackbar: MatSnackBar,
              private fb: FormBuilder
  )
  { this.contactForm = this.fb.group({
    from: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    body: ['', Validators.required]
  });}


  contactUs(){
    
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;

    }

    let from: string = this.contactForm.get('from')?.value;
    let subject: string = this.contactForm.get('subject')?.value;
    let body: string = this.contactForm.get('body')?.value;

    this.emailService.contactUs(from, subject, body).pipe(
      tap(()=>{
        this.snackbar.open("Email was sent!", 'Close', {duration:5000});
      }),
      catchError((error) =>{
        console.error(error);
        throw error;
      })
    ).subscribe();
 
}
}
