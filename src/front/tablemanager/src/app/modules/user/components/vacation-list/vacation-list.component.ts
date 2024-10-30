import { EmployeeService } from './../../../../auth/services/employee/employee.service';
import { VacationRequestService } from './../../../../auth/services/vacationRequest/vacation-request.service';
import { Component, OnInit } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';
import { VacationRequest } from '../../../../model/VacationRequest';
import { Employee } from '../../../../model/Employee';
import { deleteSlideOut, fade, slideIn } from '../../../../animations';
import { MatDialog } from '@angular/material/dialog';
import { VacationAnimationService } from '../../../../auth/services/vacationRequest/vacation-animation.service';
import { catchError, tap } from 'rxjs';
import { AddVacationComponent } from './add-vacation/add-vacation.component';
import { EditVacationComponent } from './edit-vacation/edit-vacation.component';
import { VacationCalendarComponent } from './vacation-calendar/vacation-calendar.component';

@Component({
  selector: 'app-vacation-list',
  templateUrl: './vacation-list.component.html',
  styleUrl: './vacation-list.component.css',
  animations:[
    fade, slideIn,deleteSlideOut
    ]
})
export class VacationListComponent implements OnInit {

  vacationRequests: VacationRequest[] = [];
  employees:Employee[] = [];
  searchQuery: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  startDate: string = '';
  endDate: string = '';
  slideStates: { [key: number]: string } = {};
  slideIn = 'out';
  monthlyData:any[] =[];
  loaded: boolean = false;
  currentYear: number = new Date().getFullYear();
  nextYear: number = this.currentYear +1;

  colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,  
    domain: [ '#4682B4','#5F9EA0', '#658354',
              '#95bb72','#c7ddb5', '#DCD7A0',
              '#DFC98A','#E3B778', '#D2B48C',
              '#8B4513','#A0522D','#4D516D' ]
  };

  constructor(private vacationService: VacationRequestService,
              private employeeService:EmployeeService,
              private vacationAnimationService: VacationAnimationService,
              private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.getRequests();
    this.getEmployees();
    this.vacationAnimationService.slideStates$.subscribe((states) =>{
      this.slideStates =states;
    });

    this.onAnimate();
  }

  openVacationCalendar(){
    this.dialog.open(VacationCalendarComponent,{
      height:'600px',
      width:'800px'
    });
  }


  onDateRangeChange(event: any): void {
    this.loaded = false;
    const selectedYear = event.target.value === 'currentYear' ? this.currentYear : this.nextYear;
    this.updateChart(selectedYear);
    setTimeout(() => {
     this.loaded = true;
    },50);
  }

  updateChart(getYear?:number): void {
    const currentYear = new Date().getFullYear();
    const yearToUse = getYear || currentYear;

    if (!this.vacationRequests || this.vacationRequests.length === 0) {
      this.monthlyData = [];
      return;
    }
  
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const vacationCounts = new Array(12).fill(0); 
  
    this.vacationRequests.forEach(req => {
      const startDate = new Date(req.startDate);
      const vacationYear = startDate.getFullYear();

      if (!isNaN(startDate.getTime()) && vacationYear === yearToUse) {
        const monthIndex = startDate.getMonth();
        vacationCounts[monthIndex]++;
      }
    });
  
    this.monthlyData = months.map((month, index) => {
      return {name: month,
      value: vacationCounts[index],
      year: yearToUse
    };
  });
  }

  
  onAnimate(){
    setTimeout(() => {
    this.slideIn == 'out' ? this.slideIn = "in" : this.slideIn = 'out';
  },100);
  }

  resetStartDate(){
    this.startDate = '';
    this.getRequests();
  }

  resetEndDate(){
    this.endDate = '';
    this.getRequests();
  }


  filterDateRange(){
    if (this.startDate && this.endDate) {
      const startDate = new Date(this.startDate).getTime();
      const endDate = new Date(this.endDate).getTime();

    this.vacationRequests = this.vacationRequests.filter(request =>{
      const requestStartDate = new Date(request.startDate).getTime();
      const requestEndDate = new Date(request.endDate).getTime();

      return (
        (requestStartDate <= endDate && requestEndDate >= startDate) 
      );
    });
  }else{
    this.getRequests();
  }
  }

  toggleSort(){
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  sortBySubmitDate(){
    this.toggleSort();

    this.vacationRequests.sort((a, b) => {
      if (a.creationDate < b.creationDate) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (a.creationDate > b.creationDate) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  sortByEndDate(){
    this.toggleSort();

    this.vacationRequests.sort((a, b) => {
      if (a.endDate < b.endDate) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (a.endDate > b.endDate) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  sortByStartDate(){
    this.toggleSort();

    this.vacationRequests.sort((a, b) => {
      if (a.startDate < b.startDate) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (a.startDate > b.startDate) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  sortByEmployeeName(){
    this.toggleSort();

    this.vacationRequests.sort((a, b) => {
      if (this.getEmployeeName(a.employeeId) < this.getEmployeeName(b.employeeId)) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (this.getEmployeeName(a.employeeId) > this.getEmployeeName(b.employeeId)) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  searchVacation(query:string){
    this.searchQuery = query;
    if(this.searchQuery.length > 0){
      this.employees = this.employees.filter(emp =>
        emp.name.toLowerCase().includes(this.searchQuery.toLowerCase()));

      this.vacationRequests = this.vacationRequests.filter(request => this.employees.some(emp => emp.id === request.employeeId));
      }else{  
        this.getEmployees();
        this.getRequests();
      }
  }

  getEmployeeName(id: number):string{
    const employee = this.employees.find(emp => emp.id === id);
  return employee?.name || 'Nameless employee';
  }

  getEmployees(){
    this.employeeService.getAllEmployees().pipe(
      tap((res) =>{
        this.employees = res;
      })
    ).subscribe();
  }

getRequestById(requestId: number){
  this.vacationService.getRequestById(requestId).subscribe();
}

getRequests(){
  this.vacationService.getVacationList().pipe(
    tap((requests)=>{
      this.vacationRequests = requests;
      this.updateChart();
      setTimeout(()=>{
        this.loaded = true;
      }, 25);
    }),
    catchError((error) =>{
     console.error("Error getting vacations: " + error);
     throw error;
    })
  ).subscribe();
}

addRequest(){
  this.loaded = false;
 const dialogRef = this.dialog.open(AddVacationComponent,{
  data:this.employees
 });

 dialogRef.afterClosed().pipe(
  tap(()=> {
    this.getRequests();
  })
).subscribe();
}

updateRequest(vacation: any): void {
  this.loaded = false;
  const dialogRef = this.dialog.open(EditVacationComponent, {
    data: vacation
  });

  dialogRef.afterClosed().pipe(
    tap(()=> {
      this.getRequests();
      this.updateChart();
    })
  ).subscribe();
}
}
