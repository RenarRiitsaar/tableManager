import { Base64Service } from './../../../../auth/services/pdfsettings/base64.service';
import { Entry } from './../../../../model/Entry';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { EntriesService } from '../../../../auth/services/entries/entries.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog'
import { DeleteConfirmComponent } from '../../../../public-components/delete-confirm/delete-confirm.component';
import { catchError, of, tap } from 'rxjs';
import { VatModalComponent } from './vat-modal/vat-modal.component';
import { StorageService } from '../../../../auth/services/storage/storage.service';
import { PdfGeneratorComponent } from './pdf-generator/pdf-generator.component';



@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.css'
})
export class EntriesComponent implements OnInit {
  vatRate: number =22;
  entries: Entry[] = [];
  editMode: {[key:number]: boolean} = {};
  sortDirection: 'asc' | 'desc' = 'asc';
  searchQuery: string = '';
  filteredEntries: Entry[] = [];


constructor(private entriesService:EntriesService,
            private snackbar: MatSnackBar,
            private dialog: MatDialog,
            private base64Service:Base64Service){}


  ngOnInit(): void {
    this.getEntries();
  
    
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


  generatePDF(entry: Entry){

  
    const dialogRef = this.dialog.open(PdfGeneratorComponent, {
      data: { id:entry.id,
              articleNum: entry.articleNum,
              articleName: entry.articleName,
              price: entry.priceBeforeTax,
              priceVAT: entry.priceAfterTax,
              inventoryAmount: entry.inventoryAmount,
              userId: entry.userId
              }
      
    });
    this.getEntries();
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


saveEntry(entry: Entry): void{
  
    entry.priceAfterTax= this.calculateVatPrice(entry.priceBeforeTax, this.vatRate);
    
this.entriesService.updateEntry(entry).pipe(
  tap((res) =>
    {
      this.snackbar.open('Entry updated successfully', 'Close', {duration: 5000});
      this.editMode[entry.id] = false;
      this.getEntries();
    }),

    catchError((error) => {
      this.snackbar.open('Error updating an entry', 'Close', {duration : 5000, panelClass: 'error-snackbar'});
      return of(null);
    })
  ).subscribe();
}

deleteEntry(id:number): void{
  const dialogRef = this.dialog.open(DeleteConfirmComponent);

  dialogRef.afterClosed().subscribe(res => {
    if(res){
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
    }
  });
}
}
