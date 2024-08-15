import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfsettingsService } from '../../../../../auth/services/pdfsettings/pdfsettings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, of, tap } from 'rxjs';
import { PdfSettings } from '../../../../../model/PdfSettings';


@Component({
  selector: 'app-edit-pdf',
  templateUrl: './edit-pdf.component.html',
  styleUrl: './edit-pdf.component.css'
})
export class EditPDFComponent implements OnInit{

  editPdfForm!: FormGroup;

  constructor(private fb:FormBuilder,
              private pdfService:PdfsettingsService,
              private snackbar: MatSnackBar,
              private dialogRef: MatDialogRef<EditPDFComponent>){}

  ngOnInit(): void {
   this.getPDF();
    this.editPdfForm = this.fb.group({
      companyName: [''],
      companyAddress: [''],
      companyCityCountry: [''],
      companyPhone: [''],
      companyEmail: [''],
      bankDetails: ['']
    });
  }

  getPDF(): void {
    this.pdfService.getPdfSettings().pipe(
      tap((data: PdfSettings) => {
        this.editPdfForm.patchValue(data);

      }),
      catchError((error) => {
        this.snackbar.open('Error getting current PDF settings', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        return of(null);

      })
    ).subscribe();
}


  onSubmit():void{
    if(this.editPdfForm.valid){
      this.pdfService.updateSettings(this.editPdfForm.value).pipe(
        tap((res) =>{
          this.snackbar.open("Pdf edited", 'Close', {duration: 5000});

        }),
        catchError((error) =>{
            this.snackbar.open('Error updating pdf settings. You must have existing pdf created!', 'Close', {duration: 5000})
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
