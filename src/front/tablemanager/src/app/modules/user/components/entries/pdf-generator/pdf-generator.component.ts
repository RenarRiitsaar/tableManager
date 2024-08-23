import { EntriesService } from './../../../../../auth/services/entries/entries.service';
import { PdfGeneratorService } from './pdf-generator.service';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Entry } from '../../../../../model/Entry';
import { catchError, Observable, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PdfSettings } from '../../../../../model/PdfSettings';
import { PdfsettingsService } from '../../../../../auth/services/pdfsettings/pdfsettings.service';
import { Base64Service } from '../../../../../auth/services/pdfsettings/base64.service';


@Component({
  selector: 'app-pdf-generator',
  templateUrl: './pdf-generator.component.html',
  styleUrl: './pdf-generator.component.css'
})

export class PdfGeneratorComponent {
  form: FormGroup;
  entryList: any[] = [
    ['Article Num', 'Article Name', 'Amount', 'Price', 'Price VAT', 'Total']
  ];
  pdfSettings!: PdfSettings | null;
  base64Image: string = '';


  constructor( public dialogRef: MatDialogRef<PdfGeneratorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pdfGeneratorService : PdfGeneratorService,
    private fb:FormBuilder,
    private entriesService: EntriesService,
    private snackbar:MatSnackBar,
    private pdfService: PdfsettingsService,
    private base64Service: Base64Service){
   
      this.form = this.fb.group({
        amount: [''],
        firstName: ['', [Validators.required, Validators.min(1)]],
        lastName: ['', [Validators.required, Validators.min(1)]],
        address: ['', [Validators.required, Validators.min(1)]],
        email: ['', [Validators.required, Validators.min(1)]]
        
        
  });
  this.getPdfSettings();
  this.getBase64();
  this.loadEntries();
}


calculateTotalWithVAT():number{
  let total = 0;

  for(let i =1; i< this.entryList.length; i++){
    const entry =this.entryList[i];
    
    const totalPrice = parseFloat(entry[5]);
    total += totalPrice;
  }
  return total;
}

calculateTotalWithoutVAT():number{
  let total = 0;

  for(let i =1; i< this.entryList.length; i++){
    const entry =this.entryList[i];
    const priceWithoutVAT = parseFloat(entry[3]);
    const amount = parseFloat(entry[2]);

    total+=priceWithoutVAT * amount;

  }
  return total
}

addProduct(entry:Entry){
  const amount = this.form.get('amount')?.value;

  this.entryList.push([
    this.data.articleNum, 
    this.data.articleName, 
    amount,
    this.data.price ,
    this.data.priceVAT,
   (this.data.priceVAT * amount).toFixed(2) 
  ]);
  
  
  const updateAmount = this.data.inventoryAmount - amount;
  const updateEntry: Entry = {
    ...this.data,                      
    inventoryAmount: updateAmount,
    priceBeforeTax: this.data.price,
    priceAfterTax: this.data.priceVAT
  };

  this.entriesService.updateEntry(updateEntry).pipe(
    tap((res) =>
      {
        this.snackbar.open('Entry added to invoice and updated database!', 'Close', {duration: 5000})
      }),
  
      catchError((error) => {
        this.snackbar.open('Error adding entry to invoice', 'Close', {duration : 5000, panelClass: 'error-snackbar'});
        return of(null);
      })
    ).subscribe();

  this.saveEntries();
}

saveEntries() {
  sessionStorage.setItem('entryList', JSON.stringify(this.entryList));
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

   generatePDF() {

  if (this.form.invalid) {
    return;
  }
  const pdfSettings = this.pdfSettings;
  const amount = this.form.get('amount')?.value;
  const firstName = this.form.get('firstName')?.value;
  const lastName = this.form.get('lastName')?.value;
  const address = this.form.get('address')?.value;
  const email = this.form.get('email')?.value;

  const randomNum = Math.floor(Math.random() * 10000000);
  const date = new Date();
  const formattedDate = `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;


  
  
  

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
              { text: `Billed to:\n`, style: 'header' },
              `Customer: ${firstName} ${lastName}\n`,
              `Email: ${email}\n`,
              `Address: ${address}\n`
            ]
          },
          {
            width: '50%',
            alignment: 'right',
            text: [
              { text: `Invoice #${randomNum}\n`, style: 'header' },
              `Date: ${formattedDate}\n`
            ]
          }
        ],
        margin: [0, 40, 0, 40]
      },
      {
        text: `Invoice #${randomNum}`,
        style: 'subheader',
        margin: [0, 0, 0, 20]
      },
      {
        table: {
          widths: ['*', '*', '*', '*', '*', '*'],
          body: [
            ['Article Num', 'Article Name', 'Amount', 'Price', 'Price VAT', 'Total'],
            ...this.entryList.slice(1)
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
                [`Price: ${this.calculateTotalWithoutVAT().toFixed(2)} EUR`],
                [`VAT(%): ${((this.calculateTotalWithVAT() - this.calculateTotalWithoutVAT())).toFixed(2)} EUR`],
                [`Total price: ${this.calculateTotalWithVAT().toFixed(2)} EUR`]
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
                  { text: 'Bank Details:\n'},
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

  this.pdfGeneratorService.generatePDF(doc, `Invoice Nr: ${randomNum}`);
  this.entryList = [];
  this.onClose();
}

  onClose(): void {
    this.dialogRef.close();
  }
}