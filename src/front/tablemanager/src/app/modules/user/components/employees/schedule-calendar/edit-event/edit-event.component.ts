import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EmployeeEventService } from '../../../../../../auth/services/employeeEvent/employee-event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../../../../../auth/services/employee/employee.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent {
  constructor(private fb:FormBuilder,
    private employeeEventService:EmployeeEventService,
    private snackbar:MatSnackBar,
    private dialogRef: MatDialogRef<EditEventComponent>,
    private employeeService:EmployeeService,
 
   ){}

}
