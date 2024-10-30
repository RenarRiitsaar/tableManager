import { Entry } from './../../../../model/Entry';
import { Component, OnInit } from '@angular/core';
import { EntriesService } from '../../../../auth/services/entries/entries.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog'
import { DeleteConfirmComponent } from '../../../../public-components/delete-confirm/delete-confirm.component';
import { catchError, of, tap } from 'rxjs';
import { VatModalComponent } from './vat-modal/vat-modal.component';
import { StorageService } from '../../../../auth/services/storage/storage.service';
import { PdfGeneratorComponent } from './pdf-generator/pdf-generator.component';
import { ProductSelectorComponent } from './product-selector/product-selector.component';
import { deleteSlideOut, fade, slideIn } from '../../../../animations';




@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.css',
  animations:[
    fade, slideIn,deleteSlideOut
    ]
})
export class EntriesComponent implements OnInit {

  slideStates: { [key: number]: 'in' | 'out' } = {};
  slideIn = 'out';
  entryList: any[] = [['Article Num', 'Article Name', 'Amount', 'Price', 'Price VAT', 'Disount %', 'Total']];
  vatRate: number =22;
  discountPercentage: number = 0;
  amount: number = 0;
  entries: Entry[] = [];
  editMode: {[key:number]: boolean} = {};
  sortDirection: 'asc' | 'desc' = 'asc';
  searchQuery: string = '';
  filteredEntries: Entry[] = [];


constructor(private entriesService:EntriesService,
            private snackbar: MatSnackBar,
            private dialog: MatDialog){}


  ngOnInit(): void {
    this.onAnimate();
    this.getEntries();
    
  }

  onAnimate(){
    setTimeout(() => {
    this.slideIn == 'out' ? this.slideIn = "in" : this.slideIn = 'out';
  },100);

  }

  searchEntry(query:string){
    
    this.searchQuery = query;
    if(this.searchQuery.length > 0){
    this.entries = this.entries.filter(entry =>
      entry.articleName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      entry.articleNum.toString().includes(this.searchQuery)
    );
    }else{
    this.entries = [...this.entries];
    this.getEntries();
     }
  }

  addProduct(entry: Entry){
    let amount = this.amount;
    let discountPercentage = this.discountPercentage;
    let discount;
    let VAT = this.vatRate;
    let price = entry.priceBeforeTax;
  
    if(discountPercentage > 0 ){
      
      discount = price / 100 * discountPercentage;
      price = price - discount;
     
    }
    
    let priceVat= (price / 100 * VAT) + price;
  
    this.entryList.push([
      entry.articleNum, 
      entry.articleName, 
      amount,
      entry.priceBeforeTax ,
      entry.priceAfterTax,
      discountPercentage,
     (priceVat * amount).toFixed(2) 
    ]);
    
    
    const updateAmount = entry.inventoryAmount - amount;
    const updateEntry: Entry = {
      ...entry,                      
      inventoryAmount: updateAmount,
      priceBeforeTax: entry.priceBeforeTax,
      priceAfterTax: entry.priceAfterTax
  
    };
  
    this.entriesService.updateEntry(updateEntry).pipe(
      tap(() =>
        {
          this.snackbar.open('Entry added to invoice and updated database!', 'Close', {duration: 5000})
          this.getEntries();
        }),
    
        catchError(() => {
          this.snackbar.open('Error adding entry to invoice', 'Close', {duration : 5000, panelClass: 'error-snackbar'});
          return of(null);
        })
      ).subscribe();
  
    this.saveEntries();
   
  }
  
  saveEntries() {
    sessionStorage.setItem('entryList', JSON.stringify(this.entryList));
  }
  

  productSelector(entry : Entry){
    const dialogRef = this.dialog.open(ProductSelectorComponent,{
      data:{ id:entry.id,
             articleNum: entry.articleNum,
             articleName: entry.articleName,
             price: entry.priceBeforeTax,
             priceVAT: entry.priceAfterTax,
             inventoryAmount: entry.inventoryAmount,
             userId: entry.userId}
    });
    dialogRef.afterClosed().subscribe(res => {
      this.discountPercentage = res.discount;
      this.amount = res.amount;
     this.addProduct(entry);
  
    })
  }
  generatePDF(){

  
    const dialogRef = this.dialog.open(PdfGeneratorComponent, {
      data: {
              vatRate: this.vatRate,
              discountPercentage: this.discountPercentage,
              amount: this.amount,
              entryList: this.entryList
              }
      
    });
    dialogRef.afterClosed().subscribe(() =>{
      this.getEntries();
      this.entryList = [['Article Nr', 'Article Name', 'Amount', 'Price', 'Price VAT', 'Disount %', 'Total']];
    })
    
  }


  toggleSort(){
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }
  sortByName(){
    this.toggleSort();

    this.entries.sort((a, b) => {
      if (a.articleName < b.articleName) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (a.articleName > b.articleName) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

 
  sortByArtNum(){
    this.toggleSort();

    this.entries.sort((a, b) => {
      if (a.articleNum < b.articleNum) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (a.articleNum > b.articleNum) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  sortByPrice(){
    this.toggleSort();

    this.entries.sort((a,b) =>{
      if(a.priceBeforeTax < b.priceBeforeTax){
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if(a.priceBeforeTax > b.priceBeforeTax){
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

  }

  sortByAmount(){
    this.toggleSort();

    this.entries.sort((a,b) =>{
      if(a.inventoryAmount < b.inventoryAmount){
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if(a.inventoryAmount > b.inventoryAmount){
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }


  addEntry(): void{
    let entry = {
      articleNum: 0,
      articleName: "Article Name",
      priceBeforeTax: 0,
      priceAfterTax: 0,
      inventoryAmount: 0,
      userId:StorageService.getUserId()
    };

   this.entriesService.addEntry(entry).subscribe(()=>{
    this.getEntries();
   });
   
  }


  openVatModal(): void {
    const dialogRef = this.dialog.open(VatModalComponent, {
      data: { vatRate: this.vatRate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.vatRate = result;
          this.entries.forEach(entry=> {
           this.saveEntry(entry);
          });
          
        
        this.getEntries();
      }
    });
  }

  calculateWithoutVAT(priceAfterTax: number, vatRate:number): number{
    return priceAfterTax / (1 + (vatRate / 100));
  }

  calculateVatPrice(priceBeforeTax: number, vatRate: number): number {
    return (priceBeforeTax * (1 + (vatRate / 100)))
  }

  enableEditing(id:number): void{
    this.editMode[id]=true;
  }

  cancelEditMode(id:number):void{
    this.editMode[id]= false;
    this.getEntries();
  }

getEntries(): void{
 this.entriesService.getEntries().subscribe((entry: Entry[]) =>
this.entries= entry);
}

onPriceBeforeTaxChange(entry: Entry): void {
 
  if(entry.priceBeforeTax && entry.priceBeforeTax != null){
    let stringPriceBefore = entry.priceBeforeTax.toString();

    if(stringPriceBefore.includes(',')){
      stringPriceBefore = stringPriceBefore.replace(',','.');
    }
      entry.priceBeforeTax = parseFloat(stringPriceBefore);
    }
    entry.priceAfterTax = this.calculateVatPrice(entry.priceBeforeTax,this.vatRate);

}

onPriceAfterTaxChange(entry: Entry): void {
  if (entry.priceAfterTax != null && entry.priceAfterTax) {
    let stringPriceAfter = entry.priceAfterTax.toString();
    if(stringPriceAfter.includes(',')){
      stringPriceAfter = stringPriceAfter.replace(',', '.');
    }
    entry.priceAfterTax = parseFloat(stringPriceAfter);
  }
    entry.priceBeforeTax = this.calculateWithoutVAT(entry.priceAfterTax, this.vatRate);
  }
 


saveEntry(entry: Entry): void{
  
    
    entry.priceAfterTax= this.calculateVatPrice(entry.priceBeforeTax, this.vatRate);
    entry.priceBeforeTax= this.calculateWithoutVAT(entry.priceAfterTax,this.vatRate);
   
    const artNumExists = this.entries.some(ent => ent.articleNum === entry.articleNum && ent.id !== entry.id);
    
    if(artNumExists){
      this.snackbar.open('Article number already exists!', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    return;
    }
    
        this.entriesService.updateEntry(entry).pipe(
          tap((res) =>{
  
              this.snackbar.open('Entry updated successfully', 'Close', {duration: 5000});
              this.editMode[entry.id] = false;
              this.getEntries();
            }),
        
            catchError((error) => {
              this.snackbar.open('Error updating entry!', 'Close', {duration : 5000, panelClass: 'error-snackbar'});
              return of(null);
            })
          ).subscribe();
}

deleteEntry(id:number): void{
  const dialogRef = this.dialog.open(DeleteConfirmComponent);

  dialogRef.afterClosed().subscribe(res => {
    if(res){
      this.slideStates[id] = 'out';

      setTimeout(() =>{
      this.entriesService.deleteEntry(id).pipe(
        tap((res) =>{
          this.snackbar.open('Entry deleted successfully', 'Close', {duration: 5000});
          this.getEntries();
  
        }),
        catchError((error) => {
          this.snackbar.open('Error deleting an entry', 'Close', {duration : 5000, panelClass: 'error-snackbar'});
          return of(null);
        })
      ).subscribe();
    },300);
    }
  });
}
}
