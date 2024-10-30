import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAnimationService {
  private slideStates = new BehaviorSubject<{ [key: number]: string }>({});
  slideStates$ = this.slideStates.asObservable();

  constructor() { }

  updateSlideState(employeeId: number, state: string) {
    const currentStates = this.slideStates.getValue();
    currentStates[employeeId] = state;
    this.slideStates.next(currentStates);
  }

  removeSlideState(employeeId: number) {
    const currentStates = this.slideStates.getValue();
    delete currentStates[employeeId];
    this.slideStates.next(currentStates);
  }
}
