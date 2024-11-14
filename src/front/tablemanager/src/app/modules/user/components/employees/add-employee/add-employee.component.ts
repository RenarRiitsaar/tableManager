import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../../../auth/services/employee/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, tap } from 'rxjs';
import { StorageService } from '../../../../../auth/services/storage/storage.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeForm!: FormGroup;
  selectedFile: File | null = null;
  allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

  constructor(private fb:FormBuilder,
    private employeeService:EmployeeService,
    private snackbar:MatSnackBar,
    private dialogRef: MatDialogRef<AddEmployeeComponent>
){}

  ngOnInit(): void {
    this.addEmployeeForm = this.fb.group({
      name: ['', [Validators.required]],
      photoURL:[''],
      email:['', [Validators.email]],
      phone:['', [Validators.required]],
      iban: ['',[Validators.required]]

    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if(file){
     
      if (!this.allowedTypes.includes(file.type)) {
        this.snackbar.open('Invalid file type. Currently only PNG, JPG, JPEG extentions are supported.', 'Close', { duration: 5000 });
        this.onCancel();
        return;
      }
     
     
      const userId = StorageService.getUserId();
      const phoneValue = this.addEmployeeForm.get('phone')?.value || '';
      const fileNameWithUserIdAndPhone = `${userId}_${phoneValue}_${file.name}`; 
      
      this.selectedFile = new File([file], fileNameWithUserIdAndPhone, {type:file.type});

      this.addEmployeeForm.patchValue({
        photoURL: fileNameWithUserIdAndPhone
      });
    }
    
  }

  onUpload(){
    if (this.selectedFile) {
      this.employeeService.uploadFile(this.selectedFile).pipe(
        tap((res)=>{
          this.snackbar.open("Photo uploaded", 'Close', {duration: 5000});
        }),
        catchError((error) =>{
          this.snackbar.open('Error uploading file.', 'Close', {duration: 5000})
          throw error;
      })
    ).subscribe();
    }
  }

  onSubmit(){
    if(this.addEmployeeForm.valid){
      this.onUpload();
      const formData = this.addEmployeeForm.value;

      this.employeeService.addEmployee(formData).pipe(
        tap(()=>{
          this.snackbar.open('Employee added!', 'Close', {duration:5000});
          this.dialogRef.close();
        }),
        catchError((error) =>{
          this.snackbar.open('Error adding an employee', 'Close', {duration:5000});
          throw error;
        })
      ).subscribe();
    }
  }
  onCancel(){
    this.dialogRef.close();
  }
}
