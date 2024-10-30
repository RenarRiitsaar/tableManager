import { EmployeeEventService } from './../../../../../auth/services/employeeEvent/employee-event.service';
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../../../auth/services/employee/employee.service';
import { Employee } from '../../../../../model/Employee';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { catchError, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EventClickArg, EventMountArg } from '@fullcalendar/core/index.js';
import { AddEventComponent } from './add-event/add-event.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { formatDate } from '@angular/common';
import { EmployeeEvent } from '../../../../../model/EmployeeEvent';
import { StorageService } from '../../../../../auth/services/storage/storage.service';
import { HowToComponent } from './how-to/how-to.component';

@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrl: './schedule-calendar.component.css'
})
export class ScheduleCalendarComponent implements OnInit{
  
  
  calendarOptions: any;
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null; 
  selectedWorkHours: number |null = null;
  selectedEvent: any = null;
  events: any[]= [];
  clickCount:number = 0;
  

  constructor(private employeeService: EmployeeService,
              private dialog:MatDialog,
              private employeeEventService:EmployeeEventService,
              private snackbar:MatSnackBar
  ){}

  ngOnInit(): void {
    this.getEmployees();
    this.buildCalendar();
    this.getEvents();
    
  setTimeout(() => {
    this.mapEvents();
  }, 100);
  }

  handleEventClick(info:any){
    this.clickCount++;
    
    if(this.clickCount ===1){
      setTimeout(() =>{
        this.clickCount = 0;
      },250);
    }

    if(this.clickCount === 2){
      this.employeeEventService.deleteEvent(info.event.extendedProps.eventId).pipe(
        tap(() =>{
          this.snackbar.open('Event removed!', 'Close', {duration:5000});
          this.buildCalendar();
          this.getEvents();
          this.mapEvents();
        }),
        catchError((error)=>{
          this.snackbar.open('Error removing event!', 'Close', {duration:5000});
          throw error;
        })
      ).subscribe();
    }
  }
  
  onWorkHoursSelect(event:MatSelectChange){
    this.selectedWorkHours = event.value;
  }

  onEventTypeSelect(event: MatSelectChange){
    this.selectedEvent = event.value;
  }

  onEmployeeSelect(event: MatSelectChange) {
    const selectedEmployeeId = event.value;
    const selected = this.employees.find(emp => emp.id === +selectedEmployeeId);

  if (selected) {
    this.selectedEmployee = selected;
  }

  if(selectedEmployeeId=== 'all'){
    this.selectedEmployee =  null;
  }
  this.buildCalendar();
  this.mapEvents();
}

  buildCalendar(){
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'selectedEmployee howto',
        center: 'title',
        right: 'prev,next today'
      },
      customButtons: {
        selectedEmployee:{
          text: this.selectedEmployee ? this.selectedEmployee.name : 'Displaying all employees'
      
        },
        howto:{
          text: '?',
          click: () => {
           this.dialog.open(HowToComponent);
          }
        }
      },
          
    

      dateClick: (info:any) => this.handleClick(info),
      eventClick: (info: EventClickArg) => this.handleEventClick(info),
      events: [],
      displayEventTime: false,
      eventDidMount: (info : EventMountArg) => {
        const eventType = info.event.extendedProps['eventType'];
        const workHours = info.event.extendedProps['workHours'];
    
        if (eventType && workHours) {
          info.el.setAttribute('title',  `${eventType}, ${workHours} hours`);
          
        }
      }
    }
    }

    mapEvents() {
      const filteredEvents = this.selectedEmployee
        ? this.events.filter(event => event.employeeId === this.selectedEmployee!.id)
        : this.events; 
  
      const calendarEvents = filteredEvents.map(event => {
        const startDate = new Date(event.startDate);
        let backgroundColor = 'blue';
  
        switch (event.eventType) {
          case 'work':
            backgroundColor = 'green';
            break;
          case 'absent':
            backgroundColor = 'red';
            break;
          case 'pardoned':
            backgroundColor = 'orange';
            break;
          case 'illness':
            backgroundColor = 'gray';
            break;
        }
  
        return {
          title: this.getEmployeeName(event.employeeId),
          start: startDate,
          backgroundColor: backgroundColor,
          extendedProps: {
            eventType: event.eventType,
            startDate: event.startDate,
            workHours: event.workHours,
            eventId: event.id
          }
        };
      });
  
      this.calendarOptions.events = calendarEvents;
    }


  handleClick(info:any){
   
    if (this.employees.length === 0) {
      this.snackbar.open("Employees not found", 'Close', {duration: 5000});
      return;
    }else if(this.selectedEmployee === null){
      this.snackbar.open("Please select an employee", 'Close', {duration: 5000});
      return;
    }else if(this.selectedEvent === null){
      this.snackbar.open("Please select an event type", 'Close', {duration: 5000});
      return;
    }else if(this.selectedWorkHours === null){
      this.snackbar.open("Please select hours", 'Close', {duration: 5000});
      return;
      }
   

    const clickDate = new Date(info.date);
    const localMidnightDate = new Date(clickDate.getFullYear(), clickDate.getMonth(), clickDate.getDate());
    const utcDate = new Date(Date.UTC(
      localMidnightDate.getFullYear(),
      localMidnightDate.getMonth(),
      localMidnightDate.getDate()
  ));
   
 
    const empEvent:EmployeeEvent ={
      eventType: this.selectedEvent,
      startDate: utcDate.toISOString(),
      employeeId: this.selectedEmployee.id,
      userId: StorageService.getUserId(),
      workHours: this.selectedWorkHours

    }
    
    this.employeeEventService.addEvent(empEvent).pipe(
      tap(() =>{
        this.buildCalendar();
        this.getEvents();
        this.mapEvents();
        this.snackbar.open("Event added!", 'Close', {duration:5000});
      }),
      catchError((error) =>{
        this.snackbar.open("Couldn't add event!", 'Close', {duration:5000});
        throw error;
      })
    ).subscribe();
    }
   
getEmployeeName(id: number):string{
  const employee = this.employees.find(emp => emp.id === id);
return employee?.name || 'Nameless employee';
}

getEvents(){
  this.employeeEventService.getEvents().pipe(
    tap((res) =>{
      this.events = res;
      this.mapEvents();
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


}
