import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VacationRequestService } from '../../../../../auth/services/vacationRequest/vacation-request.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VacationAnimationService } from '../../../../../auth/services/vacationRequest/vacation-animation.service';
import { catchError, tap } from 'rxjs';
import { DeleteConfirmComponent } from '../../../../../public-components/delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-edit-vacation',
  templateUrl: './edit-vacation.component.html',
  styleUrl: './edit-vacation.component.css'
})
export class EditVacationComponent {
  editVacationForm!: FormGroup;
  
  constructor(private fb:FormBuilder,
              private vacationService:VacationRequestService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackbar: MatSnackBar,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<EditVacationComponent>,
              private vacationAnimationService: VacationAnimationService
              
  ){}
  ngOnInit(): void {
    this.editVacationForm = this.fb.group({
      id:[this.data.id],
      startDate: [this.data.startDate, [Validators.required]],
      endDate: [this.data.endDate, [Validators.required]],
      comment: [this.data.comment]
    });
  }
    onSubmit(){
    if(this.editVacationForm.valid){
      const formData = this.editVacationForm.value;
      this.vacationService.updateRequest(formData).pipe(
        tap(()=>{
          this.snackbar.open('Request edited!', 'Close', {duration:5000});
          
        }),
        catchError((error)=>{
          this.snackbar.open("The employee doesn't have vacation reserve or vacation is planned too late ahead (14 days)", 'Close', {duration:5000});
          throw error;
        })
      ).subscribe();
      this.dialogRef.close();
    }
  }

  deleteRequest(requestId: number){
    const dialogRef = this.dialog.open(DeleteConfirmComponent);
  
    dialogRef.afterClosed().subscribe(res =>{
      if(res){
       this.vacationAnimationService.updateSlideState(requestId, 'out');

      setTimeout(() => {
        this.vacationService.deleteRequest(requestId).pipe(
          tap(()=>{
            this.snackbar.open('Request deleted!', 'Close', {duration:5000});
            this.dialogRef.close();
          }),
          catchError((error)=>{
          this.snackbar.open('Error deleting request!', 'Close', {duration:5000});
          throw error;
          })
        ).subscribe();
      }, 20);
    }
    });
  }
}
