import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VacationAnimationService {

  constructor() { }

  private slideStates = new BehaviorSubject<{ [key: number]: string }>({});
  slideStates$ = this.slideStates.asObservable();

  updateSlideState(requestId: number, state: string) {
    const currentStates = this.slideStates.getValue();
    currentStates[requestId] = state;
    this.slideStates.next(currentStates);
  }

  removeSlideState(requestId: number) {
    const currentStates = this.slideStates.getValue();
    delete currentStates[requestId];
    this.slideStates.next(currentStates);
  }
}
