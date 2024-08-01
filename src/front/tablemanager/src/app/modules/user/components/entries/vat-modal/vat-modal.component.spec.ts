import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatModalComponent } from './vat-modal.component';

describe('VatModalComponent', () => {
  let component: VatModalComponent;
  let fixture: ComponentFixture<VatModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VatModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
