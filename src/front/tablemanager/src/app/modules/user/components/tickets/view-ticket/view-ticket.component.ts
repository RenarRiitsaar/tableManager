import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrl: './view-ticket.component.css'
})
export class ViewTicketComponent {
 

  constructor( public dialogRef: MatDialogRef<ViewTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}
 
  onClose(): void {
    this.dialogRef.close();
  }
  
}
