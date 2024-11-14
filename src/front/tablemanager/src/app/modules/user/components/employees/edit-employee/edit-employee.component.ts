import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../../../auth/services/employee/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeeAnimationService } from '../../../../../auth/services/employee/employee-animation.service';
import { catchError, tap } from 'rxjs';
import { DeleteConfirmComponent } from '../../../../../public-components/delete-confirm/delete-confirm.component';
import { VacationRequestService } from '../../../../../auth/services/vacationRequest/vacation-request.service';
import { VacationRequest } from '../../../../../model/VacationRequest';
import { StorageService } from '../../../../../auth/services/storage/storage.service';
import { EmployeeEventService } from '../../../../../auth/services/employeeEvent/employee-event.service';
import { EmployeeEvent } from '../../../../../model/EmployeeEvent';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit{
  editEmployeeForm!: FormGroup;
  selectedFile: File | null = null;
  allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  originalPhoto: string = '';
  
  constructor(private fb:FormBuilder,
    private employeeService:EmployeeService,
    private snackBar:MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EditEmployeeComponent>,
    private employeeAnimationService: EmployeeAnimationService,
    private vacationService:VacationRequestService,
    private employeeEventService: EmployeeEventService
){}

  ngOnInit(): void {
    this.editEmployeeForm = this.fb.group({
      id: [this.data.id],
      name: [this.data.name, [Validators.required]],
      photoURL:[this.data.photoURL],
      email: [this.data.email, [Validators.required]],
      phone: [this.data.phone, [Validators.required]],
      iban: [this.data.iban, [Validators.required]]
    });

    this.originalPhoto = this.data.photoURL;

  }

  deletePhoto(photo: string){
    this.employeeService.deletePhoto(photo).subscribe();
  }

  onUpload(){
    if (this.selectedFile !== null) {
      this.employeeService.uploadFile(this.selectedFile).pipe(
        tap((res)=>{
          this.snackBar.open("Photo uploaded and employee edited", 'Close', {duration: 5000});
        }),
        catchError((error) =>{
          this.snackBar.open('Error uploading file.', 'Close', {duration: 5000})
          throw error;
      })
    ).subscribe();
    }
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if(file){
     
      if (!this.allowedTypes.includes(file.type)) {
        this.snackBar.open('Invalid file type. Currently only PNG, JPG, JPEG extentions are supported.', 'Close', { duration: 5000 });
        this.onCancel();
        return;
      }
     
     
      const userId = StorageService.getUserId();
      const phoneValue = this.editEmployeeForm.get('phone')?.value || '';
      const fileNameWithUserIdAndPhone = `${userId}_${phoneValue}_${file.name}`; 
      
      this.selectedFile = new File([file], fileNameWithUserIdAndPhone, {type:file.type});

      
      this.editEmployeeForm.patchValue({
        photoURL: fileNameWithUserIdAndPhone
      });
      if(this.data.photoURL !== this.editEmployeeForm.get('photoURL')){
      this.deletePhoto(this.originalPhoto);
      }
    }
  }

  onSubmit(){
    if(this.editEmployeeForm.valid){
    const formData = this.editEmployeeForm.value;
    this.onUpload();

    this.employeeService.updateEmployee(formData).pipe(
      tap(()=>{
        this.snackBar.open('Employee edited!', 'Close', {duration:5000});
        this.dialogRef.close();
      }),
      catchError((error) =>{
        this.snackBar.open('Error updating employee', 'Close', {duration:5000});
        throw error;
      })
    ).subscribe();
    }
  }

  deleteEmployee(employeeId:number){
    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(res =>{
      if(res){
        this.deleteEmployeeWorkData(employeeId);
        this.employeeAnimationService.updateSlideState(employeeId, 'out');
        this.deleteEmployeeVacations(employeeId);
        this.deletePhoto(this.data.photoURL)
      
      setTimeout(() => {
        this.employeeService.deleteEmployee(employeeId).pipe(
          tap(() =>{
            this.snackBar.open("Employee deleted!", 'Close' , {duration:5000});
            this.dialogRef.close();
          }),
          catchError((error)=>{
            this.snackBar.open("Error deleting employee!", 'Close', {duration:5000});
            this.dialogRef.close();
            throw error;
          })
        ).subscribe();
      }, 120);
    }
    });
  }
  
  deleteEmployeeWorkData(employeeId: number){

    
     this.employeeEventService.getEvents().pipe(
      tap((events: any[]) =>{
        if(events){
          for(let ev of events){
            if(ev.employeeId === employeeId){
            this.employeeEventService.deleteEvent(ev.id).subscribe();
            }
          }
        }
      })
     ).subscribe();
 }


  deleteEmployeeVacations(employeeId:number){
    this.vacationService.getVacationList().pipe(
      tap((requests:VacationRequest[]) =>{
        if(requests){
          for(let req of requests){
            if(req.employeeId == employeeId){
              this.vacationService.deleteRequest(req.id).subscribe();
            }
          }
        }
      })
    ).subscribe();
  }

  onCancel(){
    this.dialogRef.close();
  }
}
