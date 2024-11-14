import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfsettingsService } from '../../../../../auth/services/pdfsettings/pdfsettings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { catchError,tap } from 'rxjs';
import { StorageService } from '../../../../../auth/services/storage/storage.service';


@Component({
  selector: 'app-add-pdf-settings',
  templateUrl: './add-pdf-settings.component.html',
  styleUrl: './add-pdf-settings.component.css'
})
export class AddPdfSettingsComponent implements OnInit {

  selectedFile: File | null = null;
  addPdfForm!: FormGroup;
  allowedTypes = ['image/png'];

  

  constructor(private fb:FormBuilder,
              private pdfService:PdfsettingsService,
              private snackbar: MatSnackBar,
              private dialogRef: MatDialogRef<AddPdfSettingsComponent>,
              private dialog: MatDialog){

               dialogRef.updateSize('500px');
              }

  ngOnInit(): void {


    this.addPdfForm = this.fb.group({
      logoURL: ['/logos/', [Validators.required]],
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      companyCityCountry: ['', Validators.required],
      companyPhone: ['', Validators.required],
      companyEmail: ['', Validators.required],
      bankDetails: ['', Validators.required]
    })
  }
  
  

  onFileSelected(event: any):void{
    const file = event.target.files[0];
    
    if(file){
     
      if (!this.allowedTypes.includes(file.type)) {
        this.snackbar.open('Invalid file type. Currently only PNG extention is supported.', 'Close', { duration: 5000 });
        this.onCancel();
        return;
      }
     
     
      const userId = StorageService.getUserId();
      const fileNameWithUserId = userId + file.name; 
      
      this.selectedFile = new File([file], fileNameWithUserId, {type:file.type});

      this.addPdfForm.patchValue({
        logoURL: '/logos/' + StorageService.getUserId() + file.name
      });
    }
  }

  onUpload(){
  if (this.selectedFile) {
    this.pdfService.uploadFile(this.selectedFile).pipe(
      tap((res)=>{
        this.snackbar.open("Logo uploaded", 'Close', {duration: 5000});
      }),
      catchError((error) =>{
        this.snackbar.open('Error uploading file.', 'Close', {duration: 5000})
        throw error;
    })
  ).subscribe();
  }
}
 
  onSubmit():void{
    if(this.addPdfForm.valid){
      this.onUpload();
      this.pdfService.addPdfSettings(this.addPdfForm.value).pipe(
        tap((res) =>{
        this.snackbar.open("Pdf Settings added", 'Close', {duration: 5000});

        }),
        catchError((error) =>{
            this.snackbar.open('Error creating pdf settings. You might have existing PDF settings.', 'Close', {duration: 5000})
            throw error;
          })
        ).subscribe();
      }
      this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close(false);
      }
}
