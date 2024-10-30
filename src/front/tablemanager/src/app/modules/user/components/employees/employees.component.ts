import { Component, OnInit } from '@angular/core';
import { deleteSlideOut, fade, slideIn } from '../../../../animations';
import { Employee } from '../../../../model/Employee';
import { EmployeeService } from '../../../../auth/services/employee/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeAnimationService } from '../../../../auth/services/employee/employee-animation.service';
import { catchError, tap } from 'rxjs';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { ScheduleCalendarComponent } from './schedule-calendar/schedule-calendar.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
  animations:[
    fade, slideIn,deleteSlideOut
    ]
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  searchQuery: string = '';
  slideStates: { [key: number]: string } = {};
  slideIn = 'out';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentYear: number = new Date().getFullYear();
  photoUrl = 'https://backend.tablemanager.ee/api/employee/EmployeePhoto/';

  constructor(private employeeService:EmployeeService,
    private dialog:MatDialog,
    private employeeAnimationService: EmployeeAnimationService
){}

  ngOnInit(): void {
    this.getEmployees();
  
    this.employeeAnimationService.slideStates$.subscribe((states) => {
      this.slideStates = states;
    });
    this.onAnimate();
  }

  openScheduleCalendar(){
  
      this.dialog.open(ScheduleCalendarComponent,{
        height:'600px',
        width:'800px'
      });
  }


  getUsedVacationDays(){
    this.employees.forEach(employee => {
      this.employeeService.getVacationDaysByEmployeeId(employee.id, this.currentYear).pipe(
        tap((days) =>{
          if(employee){
          employee.days = days;
          }
        }),
        catchError((error) =>{
          console.error("Couldn't get used days: " + error);
          throw error;
        })
      ).subscribe();
      
    });
  }

  toggleSort(){
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  sortByEmployeeId(){
    this.toggleSort();

    this.employees.sort((a,b) =>{
      if(a.id && b.id){
        if(a.id < b.id){
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if(a.id > b.id){
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      } else if (a.id == null) {

        return this.sortDirection === 'asc' ? 1 : -1;

      } else {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
    });
  }

  sortByName(){
    this.toggleSort();

    this.employees.sort((a, b) => {
      if (a.name < b.name) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (a.name > b.name) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  sortByRemainingVacationDays() {
    this.toggleSort();

    this.employees.sort((a, b) => {
      if (a.days && b.days) {
        if (a.days < b.days) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (a.days > b.days) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      } else if (a.days == null) {

        return this.sortDirection === 'asc' ? 1 : -1;

      } else {

        return this.sortDirection === 'asc' ? -1 : 1;
      }
    });
  }

  searchEmployee(query: string){
    this.searchQuery = query;

    if(this.searchQuery.length > 0){
      this.employees = this.employees.filter(emp =>
        emp.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }else{
      this.getEmployees();
    }
  }

  onAnimate(){
    setTimeout(() => {
    this.slideIn == 'out' ? this.slideIn = "in" : this.slideIn = 'out';
  },100);
  }

  getEmployees(){
    this.employeeService.getAllEmployees().pipe(
      tap((res) =>{
        this.employees = res;
        this.getUsedVacationDays();
      })
    ).subscribe();
  }

  addEmployee(){
    const dialogRef = this.dialog.open(AddEmployeeComponent);
  
    dialogRef.afterClosed().pipe(
      tap(()=> {
        this.getEmployees();
      })
    ).subscribe();
  }

  updateEmployee(employee:any){
 const dialogRef = this.dialog.open(EditEmployeeComponent, {
  data: employee
});

 dialogRef.afterClosed().pipe(
  tap(()=>{
    this.getEmployees();
  })
).subscribe();
  }
}
