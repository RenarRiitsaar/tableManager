import { Component, OnInit } from '@angular/core';
import { PdfGeneratorComponent } from '../../entries/pdf-generator/pdf-generator.component';
import { PdfsettingsService } from '../../../../../auth/services/pdfsettings/pdfsettings.service';
import { PdfSettings } from '../../../../../model/PdfSettings';
import { catchError, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrl: './view-pdf.component.css'
})
export class ViewPdfComponent implements OnInit{

  pdfSettings: PdfSettings | null = null;

  constructor(private pdfGenerator: PdfGeneratorComponent,
              private pdfService:PdfsettingsService,
              private snackbar: MatSnackBar
  ){}

  getPdfSettings(){
    this.pdfService.getPdfSettings().pipe(
      tap((settings: PdfSettings) =>{
        this.pdfSettings = settings;
      }),
      catchError((error) => {
        this.snackbar.open('Error getting PDF settings', 'Close', {duration : 5000, panelClass: 'error-snackbar'});
        return of(null);

      })
      ).subscribe();
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
