import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeEventService } from '../../../../../../auth/services/employeeEvent/employee-event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../../add-employee/add-employee.component';
import { StorageService } from '../../../../../../auth/services/storage/storage.service';
import { catchError, tap } from 'rxjs';
import { EmployeeService } from '../../../../../../auth/services/employee/employee.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.css'
})
export class AddEventComponent implements OnInit{
  addEventForm!: FormGroup;
  employees: any[] = [];

  constructor(private fb:FormBuilder,
               private employeeEventService:EmployeeEventService,
               private snackbar:MatSnackBar,
               private dialogRef: MatDialogRef<AddEmployeeComponent>,
               private employeeService:EmployeeService,
            
              ){}

  ngOnInit(): void {
   this.getEmployees();
   const defaultStartDate = new Date();
    const defaultEndDate = new Date();
    defaultStartDate.setHours(8, 0, 0);
    defaultEndDate.setHours(16, 30, 0);
    
    this.addEventForm = this.fb.group({
      eventType:['', [Validators.required]],
      startDate:[this.formatDate(defaultStartDate), [Validators.required]],
      endDate:[this.formatDate(defaultEndDate),[Validators.required]],
      employeeId:['',[Validators.required]],
      userId:[StorageService.getUserId()]
    });
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); 
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0'); 
    const min = String(date.getMinutes()).padStart(2, '0'); 

    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  getEmployees(){
    this.employeeService.getAllEmployees().pipe(
      tap((res) =>{
        this.employees = res;
      }),
      catchError((error) =>{
        console.error(error);
        throw error;
      })
    ).subscribe();
  }

  onSubmit(){
    if(this.addEventForm.valid){
      const formData = this.addEventForm.value;

      this.employeeEventService.addEvent(formData).pipe(
        tap(() =>{
          this.snackbar.open('Event added!', 'Close', {duration:5000});
        }),
        catchError((error)=>{
          this.snackbar.open("Error adding an Event!", 'Close', {duration:5000});
          throw error;
        })
      ).subscribe();
    }
    this.dialogRef.close();
  }
  onCancel(){
    this.dialogRef.close();
  }
}
