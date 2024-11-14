import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditEventComponent } from '../../schedule-calendar/edit-event/edit-event.component';

@Component({
  selector: 'app-cell-info',
  templateUrl: './cell-info.component.html',
  styleUrl: './cell-info.component.css'
})
export class CellInfoComponent implements OnInit {

constructor(@Inject(MAT_DIALOG_DATA) public data: any,
            public dialogRef: MatDialogRef<CellInfoComponent>,
            public dialog: MatDialog){}


  ngOnInit(): void {
   
  }

  onEditEvent(){
  
    this.dialog.open(EditEventComponent,{
      data: {
        employeeId: this.data.employeeId,
        employeeName: this.data.employeeName,
        startDate: this.data.startDate,
        eventType: this.data.eventType,
        hours: this.data.workHours,
        eventId: this.data.eventId
      }
    })
  }

}
