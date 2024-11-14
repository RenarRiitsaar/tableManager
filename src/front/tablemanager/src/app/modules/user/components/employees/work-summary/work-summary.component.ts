import { EmployeeAnimationService } from './../../../../../auth/services/employee/employee-animation.service';
import { tap } from 'rxjs';
import { EmployeeEventService } from '../../../../../auth/services/employeeEvent/employee-event.service';
import { EmployeeEvent } from '../../../../../model/EmployeeEvent';
import { EmployeeService } from './../../../../../auth/services/employee/employee.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Employee } from '../../../../../model/Employee';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { CellInfoComponent } from './cell-info/cell-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-work-summary',
  templateUrl: './work-summary.component.html',
  styleUrl: './work-summary.component.css'
})
export class WorkSummaryComponent implements OnInit{

  selectedMonthNum: number = new Date().getMonth()+1;
  selectedYear: number = 2024;
  currentMonth: string = '';
  empEvents: EmployeeEvent[] = [];
  employees: Employee[] = [];
  days: string[] = []; 
  employeeOverTime: number = 0;
  searchQuery: string = '';

  constructor(private employeeService:EmployeeService,
              private eventService:EmployeeEventService,
              private dialog:MatDialog,
              private snackbar: MatSnackBar
  ){}


  ngOnInit(): void {
    this.getEvents();
    this.getEmployees();
    this.generateDays();
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


  onMonthSelect(event: MatSelectChange){
    const selectedMonth = event.value;
    this.selectedMonthNum = selectedMonth;
  
    this.days = [];
    this.generateDays();
   
  
  }

  getRequiredHours(empId:number){
    const empEvents = this.empEvents.filter((evnt) => evnt.employeeId === empId);
   
    let requiredHours = 0;
 
    for(let evt of empEvents){
     const evtDate = new Date(evt.startDate);

     if(evtDate.getMonth()+1 == this.selectedMonthNum){

      if(evt.eventType !=="illness" && evt.eventType !== 'vacation' ){ 
        requiredHours += 8
       }

      if(evt.eventType === 'illness' && evt.workHours < 8){
        requiredHours += evt.workHours
      }

     }
   }
    return requiredHours
  }

  getOverTime(empId: number){
   const empEvents = this.empEvents.filter((evnt) => evnt.employeeId === empId);
   
   let overTimeHours = 0;
   let totalWorkHours = this.getTotalHours(empId);
   let requiredHours = this.getRequiredHours(empId);

   for(let evt of empEvents){
    const evtDate = new Date(evt.startDate);

    if(evtDate.getMonth()+1 == this.selectedMonthNum ){ 

      if(evt.eventType !== 'illness' && evt.eventType !== 'vacation'){
      overTimeHours = (totalWorkHours- requiredHours );
      }

   }
  }
   return overTimeHours;
  }

  getTotalHours(empId: number){
 
    let totalHours = 0;

      const empEvents = this.empEvents.filter((evnt) => evnt.employeeId === empId);
     for(let evnt of empEvents){
      const month = new Date(evnt.startDate).getMonth()+1;
      
      if (empId == evnt.employeeId && this.selectedMonthNum == month) {

        if(evnt.eventType == 'illness'){
          if(evnt.workHours < 8){
          totalHours += evnt.workHours
          }
        }

      if(evnt.eventType =='work'){
        totalHours += evnt.workHours;
      }

       if(evnt.eventType !='work'  && evnt.eventType != "illness"){
        const calculateRemainingHours = 8 - evnt.workHours ;
        totalHours+= calculateRemainingHours;
      }
     } 
    }
    return totalHours;
  }

  getHoursByDay(day:string, empId:number){
    let empHours: string = '';
  
  
    const getEvent = this.empEvents.filter((evnt) => new Date(evnt.startDate).getDate().toString() === day);

    for(let empEv of getEvent ){
      const month = new Date(empEv.startDate).getMonth();
      
      if(empId == empEv.employeeId && month +1 == this.selectedMonthNum){
      
      if(empEv.eventType == 'work'){
        return empHours = String(empEv.workHours);
      
      }else if(empEv.eventType == 'pardoned'){
        if(empEv.workHours >= 8){
        empHours = 'P';
        }else{
          empHours = String(8 - empEv.workHours);
        }

    }else if(empEv.eventType == 'illness'){

      if(empEv.workHours == 0 || empEv.workHours >= 8 ){
      empHours = 'S';
      }else{
        empHours = String(empEv.workHours);
      }

  }else if(empEv.eventType == 'absent'){
    if(empEv.workHours >= 8){
    empHours = 'A';
    }else{
      empHours = String(8- empEv.workHours);
    }

  }else if(empEv.eventType == 'vacation'){
   empHours = 'V';
  }
  }
}
  return empHours;
}


  
  cellInfo(day:string, empId:number){
    
   
    let getEvent: string | any[] = [];
    if(empId != null){
     getEvent = this.empEvents.filter((evnt) => new Date(evnt.startDate).getDate().toString() === day &&
     this.selectedMonthNum == new Date(evnt.startDate).getMonth()+1  &&
      evnt.employeeId === empId);
      
  }
  
    if(getEvent.length > 0){
      
    this.employeeService.getEmployeeById(empId).subscribe((emp) => {
      this.dialog.open(CellInfoComponent, {
        data: {
          event: getEvent.length > 0 ? getEvent[0] : null,
          employeeName: emp?.name || 'Unknown',
          employeeId: emp?.id,
          eventId: getEvent[0].id,
          startDate: getEvent[0].startDate
        }
      });
    });
  }else{
    this.snackbar.open('No events on given day!', 'Close', {duration:5000});
    }
  }


  getEvents(){
    this.eventService.getEvents().pipe(
      tap((res) =>{
        this.empEvents = res;
      })
    ).subscribe();
  }

  getEmployees(){
    this.employeeService.getAllEmployees().pipe(
      tap((res) =>{
        this.employees = res;
      })
    ).subscribe();
  }

  generateDays(): void {
    const months: string[] = ['January', 'February', 'March',
                              'April', 'May', 'June',
                              'July', 'August', 'September',
                              'October', 'November','December'];

    const date = new Date();
    date.setMonth(this.selectedMonthNum -1);
    const year = this.selectedYear;
    const month = this.selectedMonthNum -1;
    this.currentMonth = months[month];
    const lastDay = new Date(year, month +1 , 0).getDate(); 

    for (let i = 1; i <= lastDay; i++) {
      this.days.push(new Date(year, month, i).toLocaleDateString('default', {  day: 'numeric' }));
    }
  }
}
