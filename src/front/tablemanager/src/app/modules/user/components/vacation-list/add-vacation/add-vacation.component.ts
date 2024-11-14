import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../../../../model/Employee';
import { VacationRequestService } from '../../../../../auth/services/vacationRequest/vacation-request.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import { catchError, tap } from 'rxjs';

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
              private dialogRef: MatDialogRef<AddVacationComponent>
              
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
  
  onSubmit(){
    if(this.addVacationForm.valid){
      const formData = this.addVacationForm.value;
  
      this.vacationService.addRequest(formData).pipe(
        tap(()=>{
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
