import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-selector',
  templateUrl: './product-selector.component.html',
  styleUrl: './product-selector.component.css'
})
export class ProductSelectorComponent {
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<ProductSelectorComponent>,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data :any
  ){
    this.form = this.fb.group({
      discount:[''],
      amount: ['', Validators.required],
      id:[this.data.id],
      articleNum: [this.data.articleNum],
      articleName:[this.data.articleName],
      price:[this.data.price],
      priceVAT:[this.data.priceVAT],
      inventoryAmount:[this.data.inventoryAmount],
      userId:[this.data.userId]
    });
  }

  onSubmit(){
    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }
  }
  
}
