import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTicketsComponent } from './userTickets.component';

describe('TicketsComponent', () => {
  let component: UserTicketsComponent;
  let fixture: ComponentFixture<UserTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
