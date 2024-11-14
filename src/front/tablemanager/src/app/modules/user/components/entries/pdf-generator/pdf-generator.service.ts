import { Inject, Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { SalesService } from '../../../../../auth/services/sales/sales.service';
import { StorageService } from '../../../../../auth/services/storage/storage.service';



@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  constructor(private salesService:SalesService) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

  }

  generatePDF(doc: any, filename: string) {
    pdfMake.createPdf(doc).getBlob((blob) =>{
      const formData = new FormData();
       formData.append('file', blob, filename + '.pdf');
       formData.append('id',StorageService.getUserId().toString())
       this.salesService.uploadFile(formData).subscribe();
    })
  
    pdfMake.createPdf(doc).download(filename);
  }
}