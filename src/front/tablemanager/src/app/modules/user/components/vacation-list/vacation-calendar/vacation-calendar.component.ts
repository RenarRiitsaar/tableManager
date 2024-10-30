import { EmployeeService } from './../../../../../auth/services/employee/employee.service';
import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../../../model/Employee';
import { VacationRequest } from '../../../../../model/VacationRequest';
import { formatDate } from '@angular/common';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventMountArg } from '@fullcalendar/core/index.js';
import { catchError, tap } from 'rxjs';
import { VacationRequestService } from '../../../../../auth/services/vacationRequest/vacation-request.service';


@Component({
  selector: 'app-vacation-calendar',
  templateUrl: './vacation-calendar.component.html',
  styleUrl: './vacation-calendar.component.css'
})
export class VacationCalendarComponent implements OnInit {
  calendarOptions: any;
  vacationRequests: VacationRequest[] = [];
  employees: Employee[] = [];

  constructor(private vacationService:VacationRequestService,
              private employeeService:EmployeeService
  ){}



  ngOnInit(): void {
    this.buildCalendar();
    this.getEmployees();
    this.getVacations();
    
    setTimeout(() => {
      this.mapRequestToEvent();
    }, 100);
  }

  mapRequestToEvent(){
    const events = this.vacationRequests.map(request => {
      const endDate = new Date(request.endDate);
      endDate.setDate(endDate.getDate() +1);
      const formattedEnd = formatDate(new Date(endDate),'yyyy-MM-dd', 'en')
  
      return {
        title: this.getEmployeeName(request.employeeId),
        start: request.startDate,
        end: formattedEnd,
        extendedProps: {
          comment: request.comment
        }
      };
    });
    this.calendarOptions.events = events;
  }

  buildCalendar(){
    this.calendarOptions = {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: '',
        center: 'title',
        right: 'prev,next today'
      },
      events: [],
      eventDidMount: (comment : EventMountArg) => {
        const com = comment.event.extendedProps['comment'];
        if (com) {
          comment.el.setAttribute('title', com);
        }
      }
    };
  }

  getVacations(){
    this.vacationService.getVacationList().pipe(
      tap((request) =>{
        this.vacationRequests = request;
      }),
      catchError((error) =>{
        console.error("couldn't get vacations: " + error);
        throw error;
      })
    ).subscribe();
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
}
