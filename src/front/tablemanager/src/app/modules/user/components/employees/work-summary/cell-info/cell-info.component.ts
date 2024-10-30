import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cell-info',
  templateUrl: './cell-info.component.html',
  styleUrl: './cell-info.component.css'
})
export class CellInfoComponent implements OnInit {

constructor(@Inject(MAT_DIALOG_DATA) public data: any,
            public dialogRef: MatDialogRef<CellInfoComponent>){}


  ngOnInit(): void {
   
  }

}
