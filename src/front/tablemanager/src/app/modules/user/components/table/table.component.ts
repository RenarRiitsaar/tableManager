import { Component, OnInit } from '@angular/core';
import { catchError, last, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditCellComponent } from './edit-cell/edit-cell.component';
import { TableService } from '../../../../auth/services/table/table.service';
import { RowService } from '../../../../auth/services/row/row.service';
import { CellService } from '../../../../auth/services/cell/cell.service';
import { CsvService } from '../../../../auth/services/csv/csv.service';
import { Cell } from '../../../../model/Cell';
import { DeleteConfirmComponent } from '../../../../public-components/delete-confirm/delete-confirm.component';
import { StorageService } from '../../../../auth/services/storage/storage.service';
import { deleteSlideOut, fade, slideIn } from '../../../../animations';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  animations:[
    fade, slideIn,deleteSlideOut
    ]
})
export class TableComponent implements OnInit {

  slideStates: { [key: number]: 'in' | 'out' } = {};
  slideIn = 'out';
  inputValue= '';
  cellFirstSelection = '';
  selectedOperation: string = '+';
  result: number = 0;
  formula:number =0;
 
  isAdminLoggedIn: boolean = StorageService.isAdmin();

  newTable = {
    name: '',
    rows: []
  };

  cells: Cell[] =[];
  tables: any[] = [];

  constructor(private tableService: TableService,
              private rowService: RowService,
              private snackbar: MatSnackBar,
              private cellService: CellService,
              private csvService: CsvService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllTables();
    this.onAnimate();
  }

  onAnimate(){
    setTimeout(() => {
    this.slideIn == 'out' ? this.slideIn = "in" : this.slideIn = 'out';
  },100);

  }

  editCell(event: MouseEvent, cellId:number, rowId:number){
    
      if(event.ctrlKey){
      const dialogRef = this.dialog.open(EditCellComponent, {
        width: '400px',
        data: { cellId, rowId}
    });
      dialogRef.afterClosed().pipe(
        tap(()=>{
          this.getAllTables();
        })
      ).subscribe();
    }
  }

  onRightClick(event: MouseEvent, cellId:number, rowId:number) {
    event.preventDefault(); 

    const calculatedCell= {
      value: this.result
    }

    this.cellService.editCell(cellId, rowId, calculatedCell).pipe(
      tap(()=>{
        this.getAllTables();
        this.snackbar.open('Calculated', 'Close', {duration:5000});
      }),
      catchError((error)=>{
        this.snackbar.open('Error on calculation', 'Close', {duration:5000});
        throw error;
      })
    ).subscribe();
    

    this.cells= [];
    this.inputValue = '';
    this.result = 0;
  }

  inputToFormula(){
    let firstIteration = true;
    let sum = 0; 
    let lastOp = '';
   

    for (let c of this.cells) {

      if (c.value !== '' && c.value !== null && c.value !== undefined) {
        const numValue = Number(c.value);
        
        if (!isNaN(numValue)) {

          if(firstIteration){
            sum = numValue;
            this.cellFirstSelection = sum.toString();
            firstIteration = false;
            continue;
          }else{
            sum= this.result;
          }
        }
         
          switch (this.selectedOperation) {
            case '+':
             sum += numValue;
             lastOp = `+${numValue}`;
              break;
            case '-':
              sum -= numValue;
              lastOp = `-${numValue}`;
              break;
            case '*':
              sum *= numValue;
              lastOp = `*${numValue}`;
              break;
            case '/':
              if (numValue !== 0) {
                sum/= numValue
                 lastOp = `/${numValue}`;
              } else {
                return;
              }
              break;
            }
          }
      }
           
   
      this.inputValue += lastOp;
    this.result = sum;
  }
  


  getCellId(cellId:number, rowId:number){
    this.cellService.getCellById(cellId, rowId).pipe(
      tap((res:Cell)=>{
        this.cells.push(res);
        this.inputToFormula();
      
      })
    ).subscribe();
  }

  deleteRow(tableId: number, rowId: number) {
    const dialogRef = this.dialog.open(DeleteConfirmComponent);
  
    dialogRef.afterClosed().pipe(
      tap(() => {
    this.rowService.deleteRow(tableId, rowId).pipe(
    tap(() => {
              this.slideStates[rowId] = 'out';
              this.snackbar.open('Row deleted', 'Close', { duration: 5000 });
              this.getAllTables();
              }),
              catchError((error) => {
              this.snackbar.open('Error deleting row', 'Close', { duration: 5000 });
              throw error;
            })
          ).subscribe();
      })
    ).subscribe();
  }


addColumn(table: any){
  const cell = {
    value: '',
    dataType: '',
    formula: ''
  };

  for(let row of table.rows){
    this.cellService.addCell(row.id, cell).pipe(
      tap(()=>{
        this.snackbar.open('Column added', 'Close', {duration:5000});
        this.getAllTables();
      }),
      catchError((error)=>{
        this.snackbar.open('Error adding column', 'Close', {duration:5000});
        throw error;
      })
    ).subscribe();
  }
}

  createRowsAndCells(table: any, rows:number){
    const cell = {
      value: '',
      dataType: '',
      formula: ''
    };
   
    for(let i=0; i<rows; i++){
     this.rowService.addRow(table.id).pipe(
      tap((row) =>{
        for(let j=0; j<rows; j++){
        this.cellService.addCell(row.id, cell).subscribe();
        }
      })
     ).subscribe();
    }  
  }

  addRow(tableId:number){
    this.rowService.addRow(tableId).pipe(
      tap((res)=>{
        this.snackbar.open("Row added", "Close", {duration:5000});

        for(let i =0; i< 10; i++){
        this.addCell(res.id);
        }

        this.getAllTables();
      }),
      catchError((error)=>{
        this.snackbar.open("Error adding row", "Close", {duration:5000});
        throw error;
      })
    ).subscribe();
  }

  addCell(rowId:number){
   const cell ={
    value:'',
    dataType:'',
    formula:''
   }
    this.cellService.addCell(rowId,cell).pipe(
      tap(()=>{
        this.snackbar.open('Cell added', 'Close', {duration:5000});
        this.getAllTables();
      }),
      catchError((error)=>{
        this.snackbar.open('Error adding cell', 'Close', {duration:5000});
        throw error;
      })
    ).subscribe();
    }

   
  
  getColumnHeaders(rows: any[]): string[] {
    const headers: string[] = [];
    if (rows.length > 0 && rows[0].cells) { 
      const numOfCells = rows[0].cells.length;
      for (let i = 0; i < numOfCells; i++) {
        headers.push(String.fromCharCode(65 + i)); 
      }
    }
    return headers;
  }

  onCellEdit(cellId: number, tableId: number, cellValue: any, cellType: any, cellFormula: any): void {
  const cell = {
      value: cellValue,
      dataType: cellType,
      formula: cellFormula 
  }

    this.cellService.editCell(cellId,tableId, cell).subscribe();
  }

  getAllTables() {
    this.tableService.getAllTables().pipe(
      tap((res) => {
        this.tables = res;
      }),
      catchError((error) => {
        console.error('Error fetching tables:', error);
        return [];
      })
    ).subscribe();
  }


  
  createTable() {
  
    this.tableService.createTable(this.newTable).pipe(
      tap((res) => {
        this.snackbar.open("Table created", 'Close', { duration: 5000 });
        if(res.id){
          this.createRowsAndCells(res, 10);
      }
      setTimeout(() =>{
      this.getAllTables();
    },700);
      }),
      catchError((error) => {
        this.snackbar.open("Error creating table", 'Close', { duration: 5000 });
        throw error; 
      })
    ).subscribe();
  
  }

  exportToCSV(tableId:number) {
  this.csvService.exportCSV(tableId).pipe(
    tap((res:string)=>{
      const blob = new Blob([res], {type: 'text,csv;charset=utf-8;'});
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'tables.csv');

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.snackbar.open('Downloaded CSV', 'Close', {duration:5000});
    }),
    catchError((error)=>{
      this.snackbar.open('Error exporting CSV', 'Close', {duration:5000});
      throw error;
    })
  ).subscribe();
  }
}