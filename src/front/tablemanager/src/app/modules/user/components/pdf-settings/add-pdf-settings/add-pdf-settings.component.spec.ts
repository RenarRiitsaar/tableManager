import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPdfSettingsComponent } from './add-pdf-settings.component';

describe('AddPdfSettingsComponent', () => {
  let component: AddPdfSettingsComponent;
  let fixture: ComponentFixture<AddPdfSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPdfSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPdfSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
