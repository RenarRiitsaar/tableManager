import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-vat-modal',
  templateUrl: './vat-modal.component.html',
  styleUrl: './vat-modal.component.css'
})
export class VatModalComponent {
  vatForm: FormGroup;

  constructor(private fb:FormBuilder,
              public dialogRef: MatDialogRef<VatModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { vatRate: number }
  ){
    this.vatForm = this.fb.group({
      vatRate: [data.vatRate, [Validators.required, Validators.min(1)]]
    });
  }
  onSave(): void {
    this.dialogRef.close(this.vatForm.value.vatRate);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
