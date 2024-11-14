import { EmployeeEventService } from './../../../../../auth/services/employeeEvent/employee-event.service';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../../../../model/Employee';
import { VacationRequestService } from '../../../../../auth/services/vacationRequest/vacation-request.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import { catchError, tap } from 'rxjs';
import { StorageService } from '../../../../../auth/services/storage/storage.service';

@Component({
  selector: 'app-add-vacation',
  templateUrl: './add-vacation.component.html',
  styleUrl: './add-vacation.component.css'
})
export class AddVacationComponent {
  addVacationForm!: FormGroup;
  employees: Employee[] = [];
  
  constructor(private fb:FormBuilder,
              private vacationService:VacationRequestService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackbar: MatSnackBar,
              private dialogRef: MatDialogRef<AddVacationComponent>,
              private employeeEventService:EmployeeEventService
              
  ){}
  ngOnInit(): void {
    this.employees = this.data;

    this.addVacationForm = this.fb.group({
      employeeId:[this.data.employeeId, [Validators.required]],
      startDate: [this.data.startDate, [Validators.required]],
      endDate: [this.data.endDate, [Validators.required]],
      comment: [this.data.comment],
      creationDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
    });
  }

  calculateDateRange(){
    let empEventStartDate = new Date(this.addVacationForm.get('startDate')?.value);
    let empEventEndDate = new Date(this.addVacationForm.get('endDate')?.value);
    let daysBetween = 0;
  
    if (empEventStartDate && empEventEndDate) {
    
      empEventStartDate.setHours(0, 0, 0, 0);
      empEventEndDate.setHours(0, 0, 0, 0);
  
  
      const diffInMs = empEventEndDate.getTime() - empEventStartDate.getTime();
  
      daysBetween = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;
    }
  
    return daysBetween;
  }

  getDatesBetween(startDate: Date, endDate: Date): string[] {
    const dates = [];
  
  
    
    let currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() +1)
    currentDate.setHours(0, 0, 0, 0);
    
    let finalDate = new Date(endDate);
    finalDate.setDate(endDate.getDate() +1);
    finalDate.setHours(0, 0, 0, 0);
  
    
    while (currentDate <= finalDate) {
      dates.push(currentDate.toISOString().split('T')[0]); 
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }
  
  onSubmit(){
    if(this.addVacationForm.valid){
      const formData = this.addVacationForm.value;

      let startDate = new Date(formData.startDate);
      let endDate = new Date(formData.endDate);

      let daysBetween = this.getDatesBetween(startDate,endDate);
  
      this.vacationService.addRequest(formData).pipe(
        tap(()=>{
          for(let day of daysBetween){

            const empEvent = {
              employeeId: this.addVacationForm.get('employeeId')?.value,
              eventType: 'vacation',
              startDate: day,
              userId: StorageService.getUserId(),
              workHours: 8
            }

            this.employeeEventService.addEvent(empEvent).subscribe();
          }

          this.snackbar.open('Request added!', 'Close', {duration:5000});
        }),
        catchError((error)=>{
          this.snackbar.open("Employee doesn't have enough vacation days left or vacation is announced too late (14 days)", 'Close', {duration:5000});
          throw error;
        })
      ).subscribe();
    }
    this.dialogRef.close();
  }
}
