import { Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'



@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  constructor() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  generatePDF(doc: any, filename: string) {
    pdfMake.createPdf(doc).download(filename);
  }

  openPDF(doc:any){
    pdfMake.createPdf(doc).open();
  }
}