import { PdfGeneratorService } from './pdf-generator.service';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PdfSettings } from '../../../../../model/PdfSettings';
import { PdfsettingsService } from '../../../../../auth/services/pdfsettings/pdfsettings.service';
import { Base64Service } from '../../../../../auth/services/pdfsettings/base64.service';
import { SalesService } from '../../../../../auth/services/sales/sales.service';
import { Sales } from '../../../../../model/Sales';



@Component({
  selector: 'app-pdf-generator',
  templateUrl: './pdf-generator.component.html',
  styleUrl: './pdf-generator.component.css'
})

export class PdfGeneratorComponent {
  form: FormGroup;
  entryList: any[] = [];
  pdfSettings!: PdfSettings | null;
  base64Image: string = '';


  constructor( public dialogRef: MatDialogRef<PdfGeneratorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pdfGeneratorService : PdfGeneratorService,
    private fb:FormBuilder,
    private snackbar:MatSnackBar,
    private pdfService: PdfsettingsService,
    private base64Service: Base64Service,
    private salesService:SalesService){
   
      this.entryList = this.data.entryList;
      this.form = this.fb.group({
        pdfLanguage:[false],
        invoiceType:['',[Validators.required]],
        paymentDate:['',[Validators.required]],
        invoiceNr: ['', [Validators.required]],
        firstName: [''],
        lastName: [''],
        address: [''],
        regNr: [''],
        email: ['']
        
        
  });
  this.getPdfSettings();
  this.getBase64();
  this.loadEntries();
  }


calculateTotalWithVAT():number{
  let total = 0;

  for(let i =1; i< this.entryList.length; i++){
    const entry =this.entryList[i];
    
    const totalPrice = parseFloat(entry[6]);
    total += totalPrice;
  }
  return total;
}

calculateTotalWithoutVAT():number{
  
  let total = 0;
  
  let discount; 
  
  for(let i =1; i< this.entryList.length; i++){
  
    const entry =this.entryList[i];
    
    let priceWithoutVAT = parseFloat(entry[3]);

    if(parseFloat(entry[5]) > 0){
      discount =  parseFloat(entry[3]) / 100 * parseFloat(entry[5]);
       priceWithoutVAT -= discount ;
    }

    const amount = parseFloat(entry[2]);

    total+=priceWithoutVAT * amount;

  }
  return total
}



loadEntries() {
  const storedEntries = sessionStorage.getItem('entryList');
  if (storedEntries) {
    this.entryList = JSON.parse(storedEntries);
  }
}

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

getBase64(){
  this.base64Service.getBase64Image().subscribe(data => {
    this.base64Image = data;
    
  });
}

formatDate(date: Date): string {
  return `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
}

addDaysToCurrentDate(paymentDate: number): string{
  
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + paymentDate);
  return this.formatDate(currentDate);

}

saveSale(sale:Sales){
  this.salesService.saveSale(sale).pipe(
    catchError((error) =>{
      console.error(error);
      throw error;
    })
  ).subscribe();
}

   generatePDF() {

  if (this.form.invalid) {
    return;
  }
  const pdfSettings = this.pdfSettings;
 
  const invoiceType = this.form.get('invoiceType')?.value;
  const invoiceNr = this.form.get('invoiceNr')?.value;
  const firstName = this.form.get('firstName')?.value;
  const lastName = this.form.get('lastName')?.value;
  const address = this.form.get('address')?.value;
  const regNr = this.form.get('regNr')?.value;
  const email = this.form.get('email')?.value;
  const paymentDate = this.form.get('paymentDate')?.value;

  const date = new Date();
  const formattedCurrentDate = this.formatDate(date);
  const formattedPaymentDate = this.addDaysToCurrentDate(paymentDate);

  const sale ={
   
    invoiceNumber : invoiceNr,
    clientName : firstName + " " + lastName,
    totalPrice : Number(this.calculateTotalWithoutVAT().toFixed(2)),
    customerAddress : address,
    customerEmail: email,
    regNr: regNr,
    saleDate:new Date(),
    invoiceType: invoiceType


  }

  let billedTo = "Billed to:";
  let customer = "Customer: ";
  let varAddress = "Address: ";
  let varDate = "Date: ";
  let varPaymentDate = "Payment date: ";
  let artNr = "Article Nr";
  let artName = "Article name";
  let varAmount = "Amount";
  let varPrice  = "Price";
  let varPriceVat = "Price VAT";
  let varDiscount = "Discount %";
  let varTotal = "Total";
  let varBankDetails = "Bank details: "
  let varVAT = "VAT";

  if(this.form.get('pdfLanguage')?.value){
    billedTo = "Kliendi info:"
    customer = "Kliendi nimi: ";
    varAddress= "Aadress: ";
    varDate = "Kuupäev: ";
    varPaymentDate = "Makse tähtaeg: ";
    artNr = "Artikli nr.";
    artName = "Artikli nimi";
    varAmount = "Kogus";
    varPrice = "Hind";
    varPriceVat = "Hind + km";
    varDiscount = "Allahindlus %";
    varTotal = "Kokku" ;
    varBankDetails = "Panga andmed: ";
    varVAT = "km";
  }
  
  
  

  const doc = {
    content: [
      {
        image: 'data:image/png;base64,' + this.base64Image,
        width: 100,
        height: 50,
       margin: [0, 0, 0, 0]
      },
    
      {
        columns: [
          {
            width: '50%',
            alignment: 'left',
            text: [
              { text: `${billedTo}\n`, style: 'header' },
              firstName ? `${customer} ${firstName} ${lastName}\n` : '',
              email ? `Email: ${email}\n` : '',
              address ? `${varAddress} ${address}\n` : '',
               regNr ? `Reg nr: ${regNr}\n` : ''
            ]
          },
          {
            width: '50%',
            alignment: 'right',
            text: [
              { text: `${invoiceType} #${invoiceNr}\n`, style: 'header' },
              `${varDate} ${formattedCurrentDate}\n`,
              `${varPaymentDate} ${formattedPaymentDate}`
            ]
          }
        ],
        margin: [0, 40, 0, 40]
      },
      {
        text: `${invoiceType} #${invoiceNr}`,
        style: 'subheader',
        margin: [0, 0, 0, 20]
      },
      {
        table: {
          widths: ['auto', '30%', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: [
            [artNr, artName, varAmount, varPrice, varPriceVat, varDiscount, varTotal],
            ...this.entryList.slice(1).map(entry => [
              { text: entry[0], alignment: 'center' },
              { text: entry[1], alignment: 'left', noWrap: false},
              { text: entry[2], alignment: 'center' },
              { text: entry[3].toFixed(2), alignment: 'center' },
              { text: entry[4].toFixed(2), alignment: 'center' },
              { text: entry[5], alignment: 'center' },
              { text: entry[6], alignment: 'center' }
          ])
        ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 20, 0, 40]
      },
      {
        columns: [
          {
            width: '70%',
            text: '',
            style: 'footer'
          },
          {
            table: {
              widths: ['*'],
              body: [
                [`${varPrice} ${this.calculateTotalWithoutVAT().toFixed(2)} EUR`],
                [`${varVAT}: ${((this.calculateTotalWithVAT() - this.calculateTotalWithoutVAT())).toFixed(2)} EUR`],
                [`${varTotal} ${this.calculateTotalWithVAT().toFixed(2)} EUR`]
              ]
            },
            width: '30%',
            alignment: 'right',
            style: 'footer'
          }
        ],
        margin: [0, 40, 0, 0]
      }
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      footer: {
        fontSize: 10,
        margin: [0, 0, 0, 10]
      }
    },
    
    pageMargins: [40, 60, 40, 80],
    footer: function(currentPage: any, pageCount: any) {
      if (currentPage === pageCount) {
        return [
          {
            columns: [
              {
                width: '50%',
                text: [
                  { text:   pdfSettings?.companyName + "\n"},
                  pdfSettings?.companyAddress  + "\n",
                  pdfSettings?.companyCityCountry  + "\n",
                  pdfSettings?.companyPhone  + "\n",
                  pdfSettings?.companyEmail + "\n"
                ],
                alignment: 'left'
              },
              {
                width: '50%',
                text: [
                  { text: `${varBankDetails}\n`},
                  pdfSettings?.bankDetails
                ],
                alignment: 'right'
              }
            ],
            margin: [40, 0, 40, 10] 
          }
        ];
      } else {
        return [];
      }
    }
  };

  this.pdfGeneratorService.generatePDF(doc, `${invoiceNr}`);
  this.entryList = [];
  this.saveSale(sale);
  this.onClose();
}

  onClose(): void {
    this.dialogRef.close();
  }
}