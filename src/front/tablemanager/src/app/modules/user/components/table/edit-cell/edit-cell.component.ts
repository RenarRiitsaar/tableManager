import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap } from 'rxjs';
import { CellService } from '../../../../../auth/services/cell/cell.service';
import { DeleteConfirmComponent } from '../../../../../public-components/delete-confirm/delete-confirm.component';


@Component({
  selector: 'app-edit-cell',
  templateUrl: './edit-cell.component.html',
  styleUrl: './edit-cell.component.css'
})
export class EditCellComponent implements OnInit{
  editCellForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private cellService: CellService,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<EditCellComponent>,
              private dialog:MatDialog,
              private snackbar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any){}


  ngOnInit(): void {
      this.editCellForm = this.fb.group({
                  value:['', [Validators.required]],
                  dataType:['', [Validators.required]],
                })
  }

  onSubmit(){
    if(this.editCellForm.valid){
      this.cellService.editCell(this.data.cellId, this.data.rowId, this.editCellForm.value).pipe(
      tap(()=>{
        this.snackBar.open('Cell edited', 'Close', {duration:5000});
      }),
      catchError((error)=>{
        this.snackBar.open('Error editing cell', 'Close', {duration:5000});
        throw error;
      })
    ).subscribe();
    }
    this.onClose();
  }

  onClose(){
    this.dialogRef.close();
  }

  deleteCell(){
    const dialogRef = this.dialog.open(DeleteConfirmComponent);
    dialogRef.afterClosed().pipe(
      tap(() => {
    this.cellService.deleteCell(this.data.rowId, this.data.cellId).pipe(
    tap(() => {
              this.snackbar.open('Cell deleted', 'Close', { duration: 5000 });
              this.onClose();
              }),
              catchError((error) => {
              this.snackbar.open('Error deleting cell', 'Close', { duration: 5000 });
              throw error;
            })
          ).subscribe();
      })
    ).subscribe();
  }
}