import { Component, OnInit } from '@angular/core';
import { EntriesService } from '../../../../auth/services/entries/entries.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Entry } from '../../../../model/Entry';
import { DeleteConfirmComponent } from '../../../../public-components/delete-confirm/delete-confirm.component';
import { catchError, of, tap } from 'rxjs';
import { VatModalComponent } from './vat-modal/vat-modal.component';
import { AddEntryModalComponent } from './add-entry-modal/add-entry-modal.component';



@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.css'
})
export class EntriesComponent implements OnInit {
  vatRate: number =22;
  entries: Entry[] = [];
  editMode: {[key:number]: boolean} = {};
 


constructor(private entriesService:EntriesService,
            private snackbar: MatSnackBar,
            private dialog: MatDialog){}


  ngOnInit(): void {
    this.getEntries();
  
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

  openAddEntryModal(): void {
    const dialogRef = this.dialog.open(AddEntryModalComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
       
      }
    });
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
