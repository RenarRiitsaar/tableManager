import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeEventService } from '../../../../../../auth/services/employeeEvent/employee-event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../../../../../auth/services/employee/employee.service';
import { catchError, tap } from 'rxjs';
import { StorageService } from '../../../../../../auth/services/storage/storage.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit {
  editEventForm!:FormGroup

  constructor(private fb:FormBuilder,
    private employeeEventService:EmployeeEventService,
    private snackbar:MatSnackBar,
    private dialogRef: MatDialogRef<EditEventComponent>,
    private employeeService:EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any
 
   ){}
  ngOnInit(): void {
    this.editEventForm = this.fb.group({
      id: [this.data.eventId],
      employeeId:[this.data.employeeId],
      startDate: [this.data.startDate],
      eventType: ['', [Validators.required]],
      workHours: ['', [Validators.required]],
      userId:[StorageService.getUserId()]
    });
  }

  onSubmit(){
    
    if(this.editEventForm.valid){
    const formData = this.editEventForm.value;

    this.employeeEventService.updateEvent(this.data.eventId, formData).pipe(
      tap(()=>{
        this.snackbar.open("Event edited!", 'Close', {duration:5000});
        console.log(formData);
      }),
      catchError((error) =>{
        this.snackbar.open('Something went wrong!', 'Close', {duration:5000});
        throw error;
      })
    ).subscribe();
    }
  }
}
