import { PdfsettingsService } from './../../../../auth/services/pdfsettings/pdfsettings.service';
import { Component, Inject, OnInit } from '@angular/core';
import { EmailService } from '../../../../auth/services/email/email.service';
import { StorageService } from '../../../../auth/services/storage/storage.service';
import { catchError, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PdfSettings } from '../../../../model/PdfSettings';


@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrl: './send-mail.component.css'
})
export class SendMailComponent implements OnInit{
  selectedFile: File | null = null;
  userId = StorageService.getUserId();
  pdfSettings!: PdfSettings | null;
  

  emailData = {
    from: '',
    to: '',
    subject: '',
    body: '',
    attachmentPath:''
  };

  constructor(private emailService: EmailService,
              private snackbar:MatSnackBar,
              private pdfSettingsService:PdfsettingsService,
              @Inject(MAT_DIALOG_DATA) public data: { invoiceNr: number, clientEmail: string },
              private dialogRef:MatDialogRef<SendMailComponent>){}

  ngOnInit(): void {
   this.getPdfSettings();
  }



  getPdfSettings(){
    this.pdfSettingsService.getPdfSettings().pipe(
      tap((settings: PdfSettings) =>{
        this.pdfSettings = settings;
        this.emailData.to = this.data.clientEmail;
        this.emailData.from = this.pdfSettings.companyEmail;
      }),
      catchError((error) => {
        this.snackbar.open('Error getting PDF settings', 'Close', {duration : 5000, panelClass: 'error-snackbar'});
        return of(null);
  
      })
      ).subscribe();
  }

  sendEmail(){
    const emailPayload = {
      from: this.emailData.from,
      to: this.emailData.to,
      subject: this.emailData.subject,
      body: this.emailData.body,
      attachmentPath: this.emailData.attachmentPath
    };

    this.emailService.sendClientEmail(emailPayload).pipe(
      tap(() =>{
      this.snackbar.open("Email sent.", 'Close', {duration:5000});
      }),
      catchError((error)=>{
        this.snackbar.open("Error sending email!", 'Close', {duration:5000});
        throw error;
      })
    ).subscribe();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadAttachmentandSend(){
    const userId = StorageService.getUserId();

   if(this.selectedFile){
    this.emailService.uploadAttachment(this.selectedFile, userId).pipe(
      tap((res)=>{
        
        const uploadedFilePath = res.filePath;
        if(uploadedFilePath){
          this.emailData.attachmentPath = uploadedFilePath;
          this.sendEmail();
          this.snackbar.open("Email Sent!", 'Close', {duration:5000});
        }else {
          this.snackbar.open("Error: File path not returned from server", 'Close', { duration: 5000 });
      }

      

      }),
      catchError((error) => {
        this.snackbar.open("Error uploading file", 'Close', {duration:5000});
        throw error;
      })
    ).subscribe();
  }else{
    this.snackbar.open('Please add an attachment', 'Close', {duration: 5000});
  }
}
}

